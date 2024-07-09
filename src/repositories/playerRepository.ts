import { IBaseRepository } from './baseRepository';
import {Player} from "../models/player";

export interface IPlayerRepository extends IBaseRepository<Player> {
    findByEmail(email: string): Promise<Player | null>;
    updatePlayerField(player_id: number, field: string, value: any): Promise<[number, Player[]]>;
    findAllOrdering(field: string, order: string): Promise<Player[]>;
}

export class PlayerRepository implements IPlayerRepository {
    async findAll(): Promise<Player[]> {
        return Player.findAll();
    }

    async findById(player_id: number): Promise<Player | null> {
        return Player.findByPk(player_id);
    }

    async findByEmail(email: string): Promise<Player | null> {
        return Player.findOne({ where: { email } } as any);
    }

    async create(item: Player): Promise<Player> {
        return Player.create(item);
    }

    async update(player_id: number, item: Partial<Player>): Promise<[number, Player[]]> {
        return Player.update(item, { where: { player_id }, returning: true } as any);
    }

    async updatePlayerField(player_id: number, field: string, value: any): Promise<[number, Player[]]> {
        return Player.update({ [field]: value }, { where: { player_id }, returning: true } as any);
    }

    async delete(player_id: number): Promise<number> {
        return Player.destroy({ where: { player_id } } as any);
    }

    async findAllOrdering(field: string, order: string): Promise<Player[]> {
        return Player.findAll({
            order: [[field, order]]
        });
    }
}