// import { MongoClient } from "mongodb";
import { nanoid } from 'nanoid';
// import { ImageModel } from '../model/image';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { minioClient, pool } from "../lib/db"
import { unlink } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const RegisteredVillageController = {
  addVillages: async function (body) {
    try {
      const { logo: file } = body; // ดึงฟิลด์ logo จาก body
      console.log("file", file);
      // const filename = file.name
      const filename = nanoid()
      for (const files of file) {

        const filename = files.name;

        // ตรวจสอบประเภทไฟล์
        if (!files.type.includes("image")) {
          return {
            data: [],
            message: "Unsupported Format File",
          };
        }

        // จัดการไฟล์ภาพ
        const ext = files.type === "image/jpeg" ? ".jpg" : ".png";
        const baseDir = "./uploads/";
        const newFileName = `${baseDir}${filename}${ext}`;

        await Bun.write(newFileName, files);

      }

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

      let Pathfile = []

      let delpath = []


      for (const files of file) {

        const filename1 = nanoid();

        // ตรวจสอบประเภทไฟล์
        if (!files.type.includes("image")) {
          return {
            data: [],
            message: "Unsupported Format File",
          };
        }

        // จัดการไฟล์ภาพ
        const ext = files.type === "image/jpeg" ? ".jpg" : ".png";
        const baseDir = "./uploads/";

        const newFileName = `${baseDir}${filename1}${ext}`;
        const filename = `${filename1}${ext}`;

        Pathfile.push(filename)
        delpath.push(newFileName)

        await Bun.write(newFileName, files);

        // File to upload (ปรับเป็นไฟล์รูปภาพที่ต้องการอัปโหลด)
        const sourceFile = join(newFileName);

        // Destination bucket
        const bucket = 'demomind';

        // Destination object name
        const destinationObject = `${filename1}${ext}`;

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

        await unlink(newFileName);

      }

      const id = nanoid();

      const path = Pathfile

      const text = `INSERT INTO article (id, image_url, text_content) VALUES ($1, $2, $3) RETURNING *`;
      const values = [id, path, text_content];

      await client.query(text, values);



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
    const bucket = 'demomind';

    const text = `SELECT id, text_content, image_url FROM article`;
    const result = await client.query(text);
    const images = result.rows;
    const expiry = 60 * 60;

    const imageWithUrls = await Promise.all(images.map(async img => {
      // ตรวจสอบว่ามีค่า image_url หรือไม่ และแปลงให้เป็น array ถ้าเป็น string
      let imageUrls = [];

      if (img.image_url) {
        // สมมติว่า image_url เป็น comma-separated string ต้องแปลงเป็น array
        imageUrls = typeof img.image_url === 'string' ? img.image_url.split(',') : img.image_url;
      }

      // สร้าง URL สำหรับแต่ละภาพใน imageUrls
      const urls = await Promise.all(imageUrls.map(async url => 
        await minioClient.presignedGetObject(bucket, url.trim(), expiry)
      ));

      return {
        ...img, // เก็บค่าทั้งหมดใน img เดิมไว้
        image_url: urls // นำ URL ที่สร้างได้ใส่เข้าไป
      };
    }));

    return imageWithUrls; // ส่งกลับข้อมูลที่สร้างแล้ว

  } catch (error) {
    console.log("Can't get img", error);
    res.status(500).send("Internal server error"); // ส่งข้อความเมื่อเกิดข้อผิดพลาด
  }
};




export const delimgtest = async (request, res) => {
  try {
    const { id } = request;  // ใช้ params ถ้าค่ามาจาก URL
    let client = await pool.connect();
    const bucket = 'demomind';

    const text = `SELECT id, text_content, image_url FROM article WHERE id=$1`;
    const result = await client.query(text, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    const image = result.rows[0];

    await minioClient.removeObject(bucket, image.image_url);

    const text_del = `DELETE FROM article WHERE id = $1`;
    await client.query(text_del, [id]);

    return { message: "Delete success" };
  } catch (error) {
    console.log("Can't del img", error);
    res.status(500).send("Internal server error");
  }
};
