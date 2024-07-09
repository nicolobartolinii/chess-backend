import {IBaseRepository} from './baseRepository';
import {Game} from '../models/game';
import {Statuses} from "../utils/statuses";
import {Op, CreationAttributes} from "sequelize";
import {ErrorFactory} from "../factories/errorFactory";

export interface IGameRepository extends IBaseRepository<Game> {
    create(item: CreationAttributes<Game>): Promise<Game>;

    findActiveGames(): Promise<Game[]>;

    findByPlayer(playerId: number, filterField?: string, filterValue?: any): Promise<Game[]>;

    updateGameStatus(gameId: number, status: string): Promise<[number, Game[]]>;
}

export class GameRepository implements IGameRepository {
    async findAll(): Promise<Game[]> {
        return Game.findAll();
    }

    async findById(id: number): Promise<Game | null> {
        return Game.findByPk(id);
    }

    async create(item: CreationAttributes<Game>): Promise<Game> {
        return Game.create(item);
    }

    async update(id: number, item: Partial<Game>): Promise<[number, Game[]]> {
        return Game.update(item, {where: {game_id: id} as any, returning: true});
    }

    async delete(id: number): Promise<number> {
        return Game.destroy({where: {game_id: id} as any});
    }

    async findActiveGames(): Promise<Game[]> {
        return Game.findAll({where: {game_status: Statuses.ACTIVE} as any});
    }

    async findByPlayer(playerId: number, filterField?: string, filterValue?: any): Promise<Game[]> {
        const whereClause: any = {
            [Op.or]: [
                { player_1_id: playerId },
                { player_2_id: playerId }
            ]
        };

        if (filterField && filterValue !== undefined) {

            whereClause[filterField] = {
                [Op.gte]: filterValue
            };
        }

        try {
            return await Game.findAll({
                where: whereClause
            });
        } catch (error) {

            throw error;
        }
    }

    async updateGameStatus(gameId: number, status: Statuses): Promise<[number, Game[]]> {
        return Game.update({game_status: status}, {where: {game_id: gameId} as any, returning: true});
    }

    async WinnerGame(winnerId: number, gameId: number): Promise<Game[]> {
        const games = await Game.findAll({
            where: {
                game_id: gameId
            }
        });

        if (games.length === 0) {
            throw ErrorFactory.notFound('Game not found');
        }

        const game = games.find(game => Number(game.winner_id) === winnerId);
        if (!game) {
            throw ErrorFactory.badRequest('Game not found with the specified winner');
        }

        return games;
    }

}
