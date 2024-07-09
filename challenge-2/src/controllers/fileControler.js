const FileModel = require("../models/FileModel");
const createResponse = require("../models/endpointMsg");
const fs=require('fs');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const path = require('path');
const multer = require('multer');


//Handle file upload and save file details to the database.
const uploadFile=  async (req, res) => {
          try {
              const file = req.file;
              const { description } = req.body;  
      
              // Create a new file record in the database
              const File = await FileModel.create({
                  name: file.originalname,
                  size: file.size,
                  description: description,  
                  mime_type: file.mimetype,
                  path: file.path
              });
      
              // Respond with the new file record
              res.status(201).json(createResponse('success', File, 'File uploaded successfully.'));
          } catch (error) {
              res.status(500).json(createResponse('err', File, 'File uploaded err.'));
          }
      }

const deleteFile= async(req,res)=>{
  
    try {
        const File = await FileModel.findByIdAndDelete(req.params.id);
        
        if (!File) {
            return res.status(400).json(createResponse('err', File, 'File delete err.'))
        }

     
        fs.unlinkSync(File.path);
        res.json(createResponse('success', File, 'File deleted successfully.'));

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const updateFile = async (req, res) => {
    try {
        const updates = req.body;
        const file = req.file;
       console.log(updates)
       console.log(file)

        // Find the file record to update
        const File = await FileModel.findById(req.params.id);
        if (!File) {
            return res.status(404).json(createResponse('err', null, 'File not found.'));
        }
  console.log(File)
        // Handle file replacement
        if (file) {
            // Delete the old file from the file system
            fs.unlinkSync(File.path);

            // Update the file details
            File.name = file.originalname;
            File.size = file.size;
            File.mime_type = file.mimetype;
            File.path = file.path;
        }

        if (updates.description) {
            File.description = updates.description;
        }

        await File.save();

        res.json(createResponse('success', File, 'File updated successfully.'));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const retrieveFile=async(req,res)=>{
    try {
        const File = await FileModel.findById(req.params.id);
        if (!File) {
            return res.status(404).json(createResponse('err', File, 'File retrieve err.'))
        }
        res.json(createResponse('success', File, 'File retrieve successfully.'));

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// //function  upload using googlecloud

// // Google Cloud Storage setup

// // Get the 'PROJECT_ID' and 'KEYFILENAME' environment variables from the .env file
// const projectId = process.env.PROJECT_ID;
// const keyFilename = process.env.KEYFILENAME;

// // Create a new Storage object with the specified project ID and key file
// const storage = new Storage({ projectId, keyFilename });

// // Define an asynchronous function to upload a file to Google Cloud Storage
// async function uploadGoogleCloud(bucketName, file, fileOutputName) {
//     try {
//         // Get a reference to the specified bucket
//         const bucket = storage.bucket(bucketName);

//         // Upload the specified file to the bucket with the given destination name
//         const ret = await bucket.upload(file, {
//             destination: fileOutputName
//         });

//         // Return the result of the upload operation
//         return ret;
//     } catch (error) {
//         // Handle any errors that occur during the upload process
//         console.error('Error:', error);
//     }
// }

// // Use an immediately-invoked function expression (IIFE) to call the uploadFile function
// (async () => {
//     // Call the uploadFile function with the specified parameters
//     const ret = await uploadFile(process.env.BUCKET_NAME, 'test.txt', 'CodingWithAdo.txt');

//     // Log the result of the upload operation to the console
//     console.log(ret);
// });

module.exports={uploadFile,deleteFile,updateFile,retrieveFile}
