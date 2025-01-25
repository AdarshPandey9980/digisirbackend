import { v2 as cloudnary } from "cloudinary";
import fs from "fs";

cloudnary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

const uploadOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudnary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log(response);

    return response;
  } catch (error) {
    // console.log(error);

    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloud;
