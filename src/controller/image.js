import { MongoClient } from "mongodb";
import { nanoid } from 'nanoid';
import { ImageModel } from '../model/image';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const RegisteredVillageController = {
  addVillages: async function (body) {
    try {
      const { logo: file } = body; // ดึงฟิลด์ logo จาก body
      // console.log("file",file.name);
      // const filename = file.name
      const filename = nanoid()


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
      const newFileName = `${baseDir}${filename}${ext}`;
      const path = `${baseDir}${filename}${ext}`;
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

export const getimg = async (request,res) => {
  try {
    const { id } = request.params; // ใช้ request.params แทน request
    const image = await ImageModel.findById(id);

    
    
    if (!image) {
      res.status = 404;
      return "Image not found";
    }

    const imagePath = join(image.path);

   return Bun.file(imagePath)
  } catch (error) {
    console.log("Can't get img", error);
    res.status(500).send("Internal server error"); // ส่งข้อความเมื่อเกิดข้อผิดพลาด
  }
};


export const test = {
  addVillages: async function (body) {
    try {
      const { logo: file } = body; // ดึงฟิลด์ logo จาก body

      const filename = nanoid()


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
      const newFileName = `${baseDir}${filename}${ext}`;
      const path = `${baseDir}${filename}${ext}`;
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