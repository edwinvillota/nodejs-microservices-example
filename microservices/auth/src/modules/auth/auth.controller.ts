import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';

@Controller('/api/v1')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    description: 'User login',
  })
  @ApiBody({
    type: AuthCredentialsDto,
    description: 'User credentials',
    examples: {
      example_01: {
        value: {
          email: 'admin@gmail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User authenticated',
  })
  @ApiUnauthorizedResponse({
    description: 'User unauthorized',
  })
  login(@Body() authCredentials: AuthCredentialsDto) {
    return this.authService.login(authCredentials);
  }

  @Get('/user-data')
  @ApiOperation({
    description: 'Get the current user data',
  })
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    description: 'User data',
  })
  @UseGuards(AuthGuard('jwt'))
  userData(@Request() req) {
    return req.user;
  }

  @Get('/check-token')
  @ApiOperation({
    description: 'Check user token',
  })
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    description: 'User logged id',
  })
  @UseGuards(AuthGuard('jwt'))
  checkToken(@Req() req, @Res() res) {
    res.set('User-id', req.user._id);
    res.send();
  }
}
