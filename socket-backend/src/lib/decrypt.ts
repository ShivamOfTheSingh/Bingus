import { createDecipheriv } from 'crypto';
import "dotenv/config";

const ALGORITHM = 'aes-256-ctr';
const SECRET_KEY = process.env.SESSION_SECRET_KEY || "";

// Dev safety
if (SECRET_KEY == "") {
    throw new Error("SESSION_SECRET_KEY is not defined in environment variables.");
}

export default function decrypt(text: string) {
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}