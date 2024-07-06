import { Sequelize } from 'sequelize';

// Singleton class to manage the database connection
export class SingletonDBConnection {
    private static single_instance: SingletonDBConnection;
    private readonly sequelize: Sequelize;

    private constructor() {
        const db_user = process.env.POSTGRES_USER;
        const db_password = process.env.POSTGRES_PASSWORD;
        const db_host = process.env.POSTGRES_HOST;
        const db_port = process.env.DATABASE_PORT;
        const db_name = process.env.POSTGRES_DB;

        if (!db_user || !db_password || !db_host || !db_port || !db_name) {
            throw new Error('Missing environment variables for database connection');
        }

        this.sequelize = new Sequelize(`postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`);
    }

    public static getInstance(): Sequelize {
        if (!SingletonDBConnection.single_instance) {
            SingletonDBConnection.single_instance = new SingletonDBConnection();
        }

        return SingletonDBConnection.single_instance.sequelize;
    }
}

export const sequelize = SingletonDBConnection.getInstance();