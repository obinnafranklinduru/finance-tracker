import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';

const rawEncryptionKey =
  process.env.APP_ENCRYPTION_KEY ||
  '73cb430200b522c663c0b0c049b8a2071191e1d1f3e8cdf3a81861e6ae62061c';

const ENCRYPTION_KEY = Buffer.from(rawEncryptionKey, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  const errorMessage = `CRITICAL CONFIGURATION ERROR: Encryption key length is ${ENCRYPTION_KEY.length} bytes, but must be 32 bytes for AES-256-CBC. Please ensure your APP_ENCRYPTION_KEY environment variable is a 64-character hexadecimal string.`;
  console.error(errorMessage);
  throw new InternalServerErrorException(errorMessage);
}

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 16 bytes for AES

export class EncryptionTransformer implements ValueTransformer {
  to(value: string | null): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new InternalServerErrorException(
        'Failed to encrypt data due to a server error.',
      );
    }
  }

  from(value: string | null): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    try {
      const parts = value.split(':');
      if (parts.length !== 2 || parts[0].length !== IV_LENGTH * 2) {
        console.error(
          'Invalid encrypted format or IV length during decryption:',
          value,
        );

        throw new InternalServerErrorException(
          'Failed to decrypt data: Invalid format.',
        );
      }
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new InternalServerErrorException(
        'Failed to decrypt data due to a server error.',
      );
    }
  }
}
