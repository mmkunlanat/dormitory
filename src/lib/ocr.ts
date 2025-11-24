import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export async function runOcrWithVisionUrl(url: string) {
  const [result] = await client.textDetection(url);
  const detections = result.textAnnotations;
  return detections?.[0]?.description || "";
}
