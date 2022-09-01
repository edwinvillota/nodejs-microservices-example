import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import configurationMongo from './modules/configuration/configuration-mongo';
import configurationAuth from './modules/configuration/configuration.auth';
import { MongoConnectionModule } from './modules/mongo-connection/mongo-connection.module';
import { UsersModule } from './modules/users/users.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationMongo, configurationAuth],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongoConnectionModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
