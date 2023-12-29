import crypto from 'crypto';
import { PRIVATE_SIGNUP_KEY } from '$env/static/private';

const algorithm = 'aes-256-cbc';

const key = PRIVATE_SIGNUP_KEY
const iv = crypto.randomBytes(16);

export const encrypt = (text: string) => {
    const bKey = Buffer.from(key, "hex")
    const cipher =
        crypto.createCipheriv(algorithm, bKey, iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };
}

export const decrypt = (cypher: { iv: string, encryptedData: string }) => {
    const bKey = Buffer.from(key, "hex")

    const iv = Buffer.from(cypher.iv, 'hex');
    const encryptedText =
        Buffer.from(cypher.encryptedData, 'hex');

    // Creating Decipher
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc', bKey, iv);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return decrypted.toString();
}