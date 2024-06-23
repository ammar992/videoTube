import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";          
          
cloudinary.config({ 
  cloud_name: 'dedi3pzhm', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

const UploadOnCloudinary = async (filePath)=>{
    try {
        if(!filePath) return null;
        const res = await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        });
        console.log("file uploaded successfully");
        fs.unlinkSync(filePath);
       return res.url;     
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log("failed to upload on cloudinary",error);
    }
   }


   export { UploadOnCloudinary};

   