import { minioClient } from "../lib/db";
import fs from 'fs';
import path from 'path';

export const addimg = async (request, response) => {
    console.log("Request received:", response);
    const { file } = request; // Extract file from request
    // console.log("Request file:", file);
    const bucket = 'demomind';
    const destinationObject = 'my-test-file.png';

    try {
        // Check if the bucket exists
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
            await minioClient.makeBucket(bucket, 'us-east-1');
            console.log('Bucket ' + bucket + ' created in "us-east-1".');
        } else {
            console.log('Bucket ' + bucket + ' exists.');
        }

        // Set the object metadata
        const metaData = {
            'Content-Type': 'image/png', // Default content type
            'X-Amz-Meta-Testing': '1234',
            'example': '5678',
        };

        // Upload the file
        const fileStream = fs.createReadStream(file.path);
        await minioClient.putObject(bucket, destinationObject, fileStream, metaData);
        console.log('File ' + file.originalname + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket);

        response.status(200).send('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
        response.status(500).send('Failed to upload file');
    } finally {
        // ลบไฟล์ชั่วคราวหลังจากอัปโหลดเสร็จ
        fs.unlink(file.path, (err) => {
            if (err) console.error('Failed to delete temporary file:', err);
        });
    }
};

export const addarticle = async (request) => {
    let client = await pool.connect();
    try {
        const { article, img_url } = request;
        
        if(article){
            return { message: "Please provide a valid data" };
        }

        const text = `INSERT INTO article (text_content, image_url ) VALUES ($1, $2) RETURNING *`
        const values =[article, img_url]

        await client.query(text, values);


    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};


export const showarticle = async () => {
    let client = await pool.connect();
    try {
        const text = `select * from article `;
        const result = await client.query(text);
        return result.rows;

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};




