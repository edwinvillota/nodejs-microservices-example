import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto/user-dto';
import { IUser } from './interfaces/IUser';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<IUser>,
  ) {
    this.populateUsers();
  }

  async populateUsers() {
    const users: UserDto[] = [
      {
        email: 'admin@gmail.com',
        password: '123456',
      },
      {
        email: 'test1@gmail.com',
        password: '123456',
      },
      {
        email: 'test2@gmail.com',
        password: '123456',
      },
    ];

    users.forEach(async (user) => {
      const userExists = await this.userModel.findOne({ email: user.email });
      if (!userExists) {
        this.createUser(user);
      }
    });
  }

  getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(user: UserDto) {
    const userExists = await this.getUserByEmail(user.email);

    if (userExists) {
      throw new ConflictException(
        `Email ${user.email} its being used by another user`,
      );
    }

    const newUser = new this.userModel(user);

    await newUser.save();

    newUser.password = undefined;

    return newUser;
  }

  getUsers() {
    return this.userModel.find({}, { password: false });
  }
}
