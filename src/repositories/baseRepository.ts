export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(item: Partial<T>): Promise<T>;
    update(id: number, item: Partial<T>): Promise<[number, T[]]>;
    delete(id: number): Promise<number>;
}