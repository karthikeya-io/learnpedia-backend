const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

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


        if(!user.authenticate(password)) {
            return { error: 'Wrong password', status: 401 };
        }

        if (user.flag === 1) {
            return { error: 'User is blocked', status: 401 };
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { _id, firstname, lastname, role, phoneno } = user;

        return { token, user: { _id, firstname, email, role, lastname, phoneno } };


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
