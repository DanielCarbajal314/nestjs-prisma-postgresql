import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard, Roles } from 'src/filters/AuthGuard';
import { CreateUserDto } from 'src/models/CreateUser.dto';
import { LoginDto } from 'src/models/Login.dto';
import { UserLoginResponseDto } from 'src/models/UserLoginResponse.dto';
import { UserService } from 'src/services/user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @Roles('Admin')
  @UseGuards(AuthGuard)
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.userService.createUser(createUser);
  }

  @Post('/login')
  @ApiResponse({ type: UserLoginResponseDto })
  async login(@Body() loginData: LoginDto) {
    return await this.userService.login(loginData);
  }
}
