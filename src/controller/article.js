import { minioClient } from "../lib/db";

export const addimg = async (filename, buffer, mimetype) => {
  const bucket = 'demomind';
  const destinationObject = filename;
  

  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, 'us-east-1');
      console.log('Bucket created.');
    }

    console.log("Uploading to MinIO:", { filename, mimetype });

    // อัปโหลดไฟล์ไปยัง MinIO โดยใช้ Buffer
    await minioClient.putObject(bucket, destinationObject, buffer, {
      'Content-Type': mimetype,
    });
    console.log('File uploaded successfully');

    return { message: 'File uploaded successfully' };
  } catch (err) {
    console.error('Error during MinIO upload:', err); // เพิ่ม log เพื่อตรวจสอบข้อผิดพลาด
    throw new Error('Failed to upload file');
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




