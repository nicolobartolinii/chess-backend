import fs from 'fs';
import path from 'path';

export const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../../jwtRS256.key');
export const PRIVATE_KEY = fs.readFileSync(path.join(PRIVATE_KEY_PATH));
export const PUBLIC_KEY = fs.readFileSync(path.join("/usr/src/app/jwtRS256.key.pub"));

export interface JwtPayload {
    id: number;
    role: number;
}