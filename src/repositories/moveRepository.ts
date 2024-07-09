import {IBaseRepository} from './baseRepository';
import {Move} from '../models/move';
import {CreationAttributes} from "sequelize";

export interface IMoveRepository extends IBaseRepository<Move> {
    create(item: CreationAttributes<Move>): Promise<Move>;

    findByGame(gameId: number): Promise<Move[]>;

    findLastMoveByGame(gameId: number): Promise<Move | null>;
}

export class MoveRepository implements IMoveRepository {
    async findAll(): Promise<Move[]> {
        return Move.findAll();
    }

    async findById(id: number): Promise<Move | null> {
        return Move.findByPk(id);
    }

    async create(item: CreationAttributes<Move>): Promise<Move> {
        return Move.create(item);
    }

    async update(id: number, item: Partial<Move>): Promise<[number, Move[]]> {
        return Move.update(item, {where: {id}, returning: true} as any);
    }

    async delete(id: number): Promise<number> {
        return Move.destroy({where: {id}} as any);
    }

    async findByGame(gameId: number): Promise<Move[]> {
        return Move.findAll({where: {game_id: gameId}, order: [['move_number', 'ASC']]} as any);
    }

    async findLastMoveByGame(gameId: number): Promise<Move | null> {
        return Move.findOne({
            where: {game_id: gameId},
            order: [['move_number', 'DESC']]
        } as any);
    }
    async findMovebyGameID(gameId: number): Promise<Move | null> {
        return Move.findOne({where: {game_id: gameId}} as any);
    }
}