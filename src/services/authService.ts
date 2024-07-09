import jwt from 'jsonwebtoken';
import {JwtPayload, PRIVATE_KEY, PUBLIC_KEY} from "../utils/jwt";
import {ErrorFactory} from "../factories/errorFactory";
import {repositories} from "../repositories";

export const loginPlayer = async (email: string, password: string) => {
    const player = await repositories.player.findByEmail(email);
    if (!player) {
        throw ErrorFactory.notFound('Invalid email or password')
    }

    const isValidPassword = await player.authenticate(password);

    if (!isValidPassword) {
        throw ErrorFactory.notFound('Invalid email or password')
    }

    return generateToken({id: player.player_id, role: player.role});
}

// TODO: Implement the registerUser function

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '48h'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, PUBLIC_KEY, {algorithms: ['RS256']});
}
