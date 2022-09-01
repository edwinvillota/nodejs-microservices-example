import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user-dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'Create a new user',
  })
  @ApiBearerAuth('jwt')
  @ApiBody({
    type: UserDto,
    description: 'User data',
    examples: {
      example_01: {
        value: {
          email: 'test@hotmail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Created user',
  })
  @ApiConflictResponse({
    description: `The email its being used by another user`,
  })
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'Get all users',
  })
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    type: UserDto,
    isArray: true,
    description: 'User list',
  })
  getUsers() {
    return this.userService.getUsers();
  }
}
