import fs from 'fs';
import path from 'path';

/** Filesystem path to the private key */
export const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../../jwtRS256.key');
/** Private key for JWT generation */
export const PRIVATE_KEY = fs.readFileSync(path.join(PRIVATE_KEY_PATH));
/** Public key for JWT verification */
export const PUBLIC_KEY = fs.readFileSync(path.join("/usr/src/app/jwtRS256.key.pub"));

/** Structure of the JWT payload */
export interface JwtPayload {
    id: number;
    role: number;
}