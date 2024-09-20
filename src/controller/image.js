import { MongoClient } from "mongodb";
import { nanoid } from 'nanoid';
import { ImageModel } from '../model/image';

export const RegisteredVillageController = {
    addVillages: async function (body) {
      try {
        const { logo: file } = body; // ดึงฟิลด์ logo จาก body
        // console.log("file",file.name);
        const filename = file.name
        

        // ตรวจสอบประเภทไฟล์
        if (!file.type.includes("image")) {
          return {
            data: [],
            message: "Unsupported Format File",
          };
        }
  
        // จัดการไฟล์ภาพ
        const ext = file.type === "image/jpeg" ? ".jpg" : ".png";
        const baseDir = "./uploads/";
        const newFileName = `${baseDir}${nanoid()}${ext}`;
        const path = `${baseDir}${nanoid()}${ext}`;
        // console.log("newFileName",newFileName);
        
        const image = await ImageModel({ path, filename })
        await image.save()
        
        await Bun.write(newFileName, file);
  
        return {
          data: {
            logoPath: newFileName,
          },
          message: "File uploaded successfully",
        };
      } catch (error) {
        console.log("🚀 ~ addVillages: ~ error:", error);
        return {
          data: [],
          message: error.message,
        };
      }
    },
  };