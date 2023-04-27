const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator, isAdmin } = require('../controllers/authController');
const { getUserById, getAllUsers, updateUser, addQuestion } = require('../controllers/userController');
const { BlobServiceClient } = require("@azure/storage-blob");


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = "container0";
// const upload = multer({ storage: multer.memoryStorage() });

// Set up multer middleware for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'profilepics/'); // Set the destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//       req.fileName = Date.now() + '-' + file.originalname;
//       cb(null, req.fileName); // Set the filename of the uploaded file
//     }
//   });
  const upload = multer({ storage: multer.memoryStorage() });

//params
router.param('userId', getUserById);

router.get('/users/:userId', isSignedIn, isAuthenticated, isAdmin, getAllUsers);



//update user
router.put('/user/:userId', isSignedIn, isAuthenticated,
    upload.single('profileImage'),
    async (req, res, next) => {
        try {
            console.log(req.file);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            req.body.profilePic = Date.now() + '-' + req.file.originalname;
            const blobClient = containerClient.getBlockBlobClient(req.body.profilePic);
            const uploadResponse = await blobClient.upload(req.file.buffer, req.file.size);
            if (uploadResponse._response.status === 201) {
              // get the url of the uploaded file from the blob service
                // req.body.profilePic = blobClient.url;
                console.log("File uploaded to Azure Blob storage successfully");
              } else {
                return res.status(500).json({ message: "Failed to upload file" });
              }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while uploading the file" });
        }
        next();
    },  
    updateUser
);

//add question
router.post('/question/:userId', isSignedIn, isAuthenticated, addQuestion);

module.exports = router;
