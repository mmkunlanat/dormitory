import vision from "@google-cloud/vision";
import fs from "fs/promises";

const client = new vision.ImageAnnotatorClient();

/**
 * OCR จาก URL ของรูปภาพ
 * @param url URL ของรูปภาพ
 * @returns ข้อความที่ตรวจจับได้
 */
export async function runOcrWithVisionUrl(url: string) {
  try {
    const [result] = await client.textDetection(url);
    const detections = result.textAnnotations;
    return detections?.[0]?.description || "";
  } catch (error) {
    console.error("OCR error (URL):", error);
    return "";
  }
}

/**
 * OCR จากไฟล์ local
 * @param filePath path ของไฟล์บนเครื่อง/server
 * @returns ข้อความที่ตรวจจับได้
 */
export async function runOcrOnLocalFile(filePath: string) {
  try {
    // อ่านไฟล์เป็น buffer
    const imageBuffer = await fs.readFile(filePath);

    // Google Vision API รองรับ buffer ด้วย image content
    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    const detections = result.textAnnotations;
    return detections?.[0]?.description || "";
  } catch (error) {
    console.error("OCR error (Local file):", error);
    return "";
  }
}
