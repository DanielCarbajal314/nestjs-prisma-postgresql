import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard, Roles } from '../filters/AuthGuard';
import { CreateUserDto, LoginDto, UserLoginResponseDto } from '../models';
import { UserService } from '../services/user.service';

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
