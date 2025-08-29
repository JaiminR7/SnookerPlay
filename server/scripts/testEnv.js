import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Force .env path from current folder
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.log("❌ .env load error:", result.error);
} else {
  console.log("✅ .env loaded manually");
  console.log("✅ MONGO_URI:", process.env.MONGO_URI);
  console.log("✅ RESEND_API_KEY:", process.env.RESEND_API_KEY?.substring(0, 5));
  console.log("✅ CLIENT_URL:", process.env.CLIENT_URL);
}
