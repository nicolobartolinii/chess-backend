import {PlayerRepository} from './playerRepository';
import {GameRepository} from './gameRepository';
import {MoveRepository} from './moveRepository';

/**
 * Repositories object that contains all repositories of the application.
 * It is used to access the repositories from the services.
 *
 * @type {Object}
 * @property {PlayerRepository} player - The player repository
 * @property {GameRepository} game - The game repository
 * @property {MoveRepository} move - The move repository
 */
export const repositories = {
    player: new PlayerRepository(),
    game: new GameRepository(),
    move: new MoveRepository()
}