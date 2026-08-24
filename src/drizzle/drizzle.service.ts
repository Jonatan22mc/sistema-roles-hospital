import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private pool!: Pool;
    public db!: NodePgDatabase;
    private readonly logger = new Logger(DrizzleService.name);

    async onModuleInit() {
        this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        });

        try {
        this.db = drizzle(this.pool);
        this.logger.log('Conexión con PostgreSQL establecida con éxito');
        } catch (error) {
        this.logger.error('Error al conectar con PostgreSQL', error);
        throw error;
        }
    }

    async onModuleDestroy() {
        if (this.pool) {
        await this.pool.end();
        this.logger.log('Conexión con PostgreSQL cerrada');
        }
    }

    getDB(): NodePgDatabase {
        return this.db;
    }
}