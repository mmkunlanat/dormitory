import fs from 'fs';
import path from 'path';

// Read .env.local file directly to avoid system environment variable conflicts
function loadEnvFromFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env.local');
  const envVars: Record<string, string> = {};

  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        envVars[key.trim()] = value;
      }
    }
  } catch (error) {
    console.error('Failed to read .env.local:', error);
  }

  return envVars;
}

const envFromFile = loadEnvFromFile();

// Use .env.local values with fallback to process.env
export const DATABASE_URL = envFromFile.DATABASE_URL || process.env.DATABASE_URL;
export const CLOUDINARY_CLOUD_NAME = envFromFile.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = envFromFile.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = envFromFile.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;
export const JWT_SECRET = envFromFile.JWT_SECRET || process.env.JWT_SECRET;

// Validate required environment variables
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Log to verify (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Environment loaded:');
  console.log('  DATABASE_URL:', DATABASE_URL?.substring(0, 20) + '...');
}