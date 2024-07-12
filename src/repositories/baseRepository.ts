/**
 * Base repository interface
 * It defines the methods that all repositories should implement.
 *
 * @interface IBaseRepository
 * @template T - The type of the entity
 *
 * @function findAll - Retrieves all entities
 * @function create - Creates a new entity
 * @function update - Updates an entity by its ID
 * @function delete - Deletes an entity by its ID
 */
export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    create(item: Partial<T>): Promise<T>;
    update(id: number, item: Partial<T>): Promise<[number, T[]]>;
    delete(id: number): Promise<number>;
}