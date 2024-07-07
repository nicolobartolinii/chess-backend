import jwt from 'jsonwebtoken';
import {PRIVATE_KEY, PUBLIC_KEY} from "../utils/jwt";
import {findPlayerByEmail} from "../models/player";

export const loginPlayer = async (email: string, password: string) => {
    const player = await findPlayerByEmail(email);
    if (!player) {
        throw new Error('User not found'); // TODO: Use factory pattern to create custom errors
    }

    const isValidPassword = await player.authenticate(password);

    if (!isValidPassword) {
        throw new Error('Invalid password');
    }

    return generateToken({email: player.email, role: player.role});
}

// TODO: Implement the registerUser function

export const generateToken = (payload: any) => {
    return jwt.sign(payload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '24h'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, PUBLIC_KEY, {algorithms: ['RS256']});
}