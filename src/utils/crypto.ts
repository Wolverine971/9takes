import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export const encrypt = (text: string) => {

    const cipher =
        crypto.createCipheriv(algorithm, key, iv);

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

    const iv = Buffer.from(cypher.iv, 'hex');
    const encryptedText =
        Buffer.from(cypher.encryptedData, 'hex');

    // Creating Decipher
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc', Buffer.from(key), iv);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return decrypted.toString();
}