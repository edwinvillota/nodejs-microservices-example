import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoConnectionModule } from '../mongo-connection/mongo-connection.module';
import { MongoConnectionService } from '../mongo-connection/mongo-connection.service';
import { IUser } from './interfaces/IUser';
import { userSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongoConnectionModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'USER_MODEL',
      useFactory: (db: MongoConnectionService) =>
        db.getConnection().model<IUser>('User', userSchema, 'users'),
      inject: [MongoConnectionService],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
