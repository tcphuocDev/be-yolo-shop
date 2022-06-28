import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const ormConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.NODE_ENV === 'development',
};
console.log({ ormConfig });

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  entities: ['dist/entities/**/*.entity.js', 'src/entities/*.ts'],
  migrations: ['dist/database/migrations/*.js', 'src/database/migrations'],
  subscribers: ['dist/observers/subscribers/*.subscriber.js'],
  cli: {
    entitiesDir: 'src/entities/*.ts',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/observers/subscribers',
  },
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: ormConfig.logging,
  extra: {
    max: ormConfig.maxPool,
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export = connectionOptions;
