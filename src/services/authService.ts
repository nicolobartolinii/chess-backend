import jwt from 'jsonwebtoken';
import {JwtPayload, PRIVATE_KEY, PUBLIC_KEY} from "../utils/jwt";
import {ErrorFactory} from "../factories/errorFactory";
import {repositories} from "../repositories";

/**
 * This function logs in a player by their email and password.
 * It uses the Player model who's been extended with the sequelize-bcrypt package in order
 * to hash and compare passwords (.authenticate method).
 *
 * @param {string} email - The email of the player
 * @param {string} password - The password of the player
 *
 * @returns {Promise<string>} - A promise that resolves when the player is logged in. The response contains a JWT token.
 */
export const loginPlayer = async (email: string, password: string): Promise<string> => {
    const player = await repositories.player.findByEmail(email);
    if (!player) {
        throw ErrorFactory.badRequest('Player not found');
    }

    const isValidPassword = await player.authenticate(password);

    if (!isValidPassword) {
        throw ErrorFactory.unauthorized('Invalid credentials');
    }

    return generateToken({id: player.player_id, role: player.role});
}

// TODO: Implement the registerUser function

/**
 * This function generates a JWT token with the given payload.
 * The token is signed with the private key and expires in 48 hours.
 *
 * @param {JwtPayload} payload - The payload to be included in the token
 *
 * @returns {string} - The generated JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '48h'});
}

/**
 * This function verifies a JWT token.
 * The token is verified using the public key.
 *
 * @param {string} token - The JWT token to be verified
 *
 * @returns The payload of the verified token
 */
export const verifyToken = (token: string) => {
    return jwt.verify(token, PUBLIC_KEY, {algorithms: ['RS256']});
}
