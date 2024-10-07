import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const SECRET_KEY = process.env.SESSION_SECRET_KEY || "";

// Dev safety
if (SECRET_KEY == "") {
    throw new Error("SESSION_SECRET_KEY is not defined in environment variables.");
}

const IV_LENGTH = 16;

export function encrypt(text: string) {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}