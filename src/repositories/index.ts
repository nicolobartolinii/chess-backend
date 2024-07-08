import {PlayerRepository} from './playerRepository';
import {GameRepository} from './gameRepository';
import {MoveRepository} from './moveRepository';

export const repositories = {
    player: new PlayerRepository(),
    game: new GameRepository(),
    move: new MoveRepository()
}