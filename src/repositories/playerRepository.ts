import { IBaseRepository } from './baseRepository';
import {Player} from "../models/player";

export interface IPlayerRepository extends IBaseRepository<Player> {
    findByEmail(email: string): Promise<Player | null>;
    updateTokens(id: number, tokens: number): Promise<[number, Player[]]>;
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

    async updateTokens(player_id: number, tokens: number): Promise<[number, Player[]]> {
        return Player.update({ tokens }, { where: { player_id }, returning: true } as any);
    }

    async delete(player_id: number): Promise<number> {
        return Player.destroy({ where: { player_id } } as any);
    }
}