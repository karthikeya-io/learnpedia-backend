const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/core-http");

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY);

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = "container0";

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(data) {
        const user = await this.userRepository.createUser(data);
        if (data.role === "educator") {
            const educator = await this.userRepository.createEducator();
            user.educator = educator;
            await user.save();
        }
        const { _id, firstname, lastname, role, phoneno } = user;
        return { _id, firstname, lastname, role, phoneno };
    }

    async getUserById(id) {
        return await this.userRepository.findById(id);
    }

    async loginUser(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { error: 'User not found', status: 401 };
        }


        if (!user.authenticate(password)) {
            return { error: 'Wrong password', status: 401 };
        }

        if (user.flag === 1) {
            return { error: 'User is blocked', status: 401 };
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        let url = "";
        if (user.profilePic ) {
        try {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(user.profilePic);
            if (await blobClient.exists()) {
                const sasToken = generateBlobSASQueryParameters({
                    containerName,
                    blobName: user.profilePic,
                    permissions: BlobSASPermissions.parse("r"), // "r" means read permission
                    startsOn: new Date(),
                    expiresOn: new Date(new Date().valueOf() + 86400), // Expires in 24 hours
                }, sharedKeyCredential).toString();

                url = blobClient.url + "?" + sasToken;
            }
        } catch (error) {
            console.error(error);
        }
    }
        console.log(url);
        const { _id, firstname, lastname, role, phoneno } = user;

        if (url === "") {
            return { token, user: { _id, firstname, email, role, lastname, phoneno } };
        }
        return { token, user: { _id, firstname, email, role, lastname, phoneno, url } };
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (!decoded) {
                return { error: 'User not logged in', status: 401 };
            }
            const user = await this.userRepository.findById(decoded._id);
            if (!user) {
                return { error: 'User not found', status: 401 };
            }
            return user;
        } catch (err) {
            throw err;
            return { error: 'User not logged in', status: 401 };
        }
    }
}

module.exports = AuthService;
