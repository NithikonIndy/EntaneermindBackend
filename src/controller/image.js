// import { MongoClient } from "mongodb";
import { nanoid } from 'nanoid';
// import { ImageModel } from '../model/image';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import {minioClient ,pool} from "../lib/db"
import { unlink } from "node:fs/promises";

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

export const getimg = async (request, res) => {
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
      let client = await pool.connect();
      const { logo: file, text_content } = body; // ดึงฟิลด์ logo และ text_content จาก body

      const filename1 = nanoid();

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

      const newFileName = `${baseDir}${filename1}${ext}`;
      const filename = `${filename1}${ext}`;

      await Bun.write(newFileName, file);

      // File to upload (ปรับเป็นไฟล์รูปภาพที่ต้องการอัปโหลด)
      const sourceFile = join(newFileName);

      // Destination bucket
      const bucket = 'demomind';

      // Destination object name
      const destinationObject = `${filename1}${ext}`;
      const path = `${baseDir}${filename1}${ext}`;

      // Check if the bucket exists
      const exists = await minioClient.bucketExists(bucket);
      if (exists) {
        console.log('Bucket ' + bucket + ' exists.');
      } else {
        await minioClient.makeBucket(bucket, 'us-east-1');
        console.log('Bucket ' + bucket + ' created in "us-east-1".');
      }

      const metaData = {
        'Content-Type': `image/${ext.replace('.', '')}`, // หรือ 'image/png' ขึ้นอยู่กับไฟล์ที่อัปโหลด
        'X-Amz-Meta-Testing': '1234',
        'example': '5678',
      };

      // Upload the file with fPutObject
      await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData);
      console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket);

      const id = nanoid();

      const text = `INSERT INTO article (id, image_url, text_content) VALUES ($1, $2, $3) RETURNING *`;
      const values = [id, filename, text_content];

      const res = await client.query(text, values);

      await unlink(newFileName);

      client.release();

      return {
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

export const getimgtest = async (request, res) => {
  try {
    let client = await pool.connect();
    const bucket = 'demomind'

    const text = `select id,text_content,image_url from article `;
    const result = await client.query(text);
    const image = result.rows;
    const expiry = 60 * 60 ; 

    const imageWithUrls = await Promise.all(image.map(async img => ({
      ...img, // เก็บค่าทั้งหมดใน img เดิมไว้
      image_url: await minioClient.presignedGetObject(bucket, img.image_url, expiry), // ใช้ await เพื่อรอ URL ใหม่
    })));

    return imageWithUrls
  } catch (error) {
    console.log("Can't get img", error);
    res.status(500).send("Internal server error"); // ส่งข้อความเมื่อเกิดข้อผิดพลาด
  }
};