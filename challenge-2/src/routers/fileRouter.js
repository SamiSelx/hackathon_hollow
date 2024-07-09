const express=require('express');
const { deleteFile, uploadGoogleCloud } = require('../controllers/fileControler');
const { updateFile } = require('../controllers/fileControler');
const { retrieveFile } = require('../controllers/fileControler');

const { uploadFile } = require('../controllers/fileControler');
const fs=require('fs');
const path = require('path');
const multer = require('multer');


const router=express.Router();

// api  to delete file by id with endpoint
router.delete('/delete/:id',deleteFile)



// api  to retrieve file information by id with endpoint.
router.route('/retrieve/:id').get(retrieveFile)


/* The files should be stored in a folder on the server.
creat the folder :*/
const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//multer.diskStorage take two function (destination and filename)
const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null,uploadDir)
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname)
          }
        })
        
const upload = multer({ storage: storage })
// api to upload files with endpoint
router.route('/upload').post(upload.single('file'),uploadFile);

// api to update file information with endpoint
router.route('/update/:id').put(upload.single('file'),updateFile)


//the second api upload files using googleCloud
//router.route('/upload/googlecloud').post(upload.single('file'),uploadGoogleCloud)

module.exports = router;
