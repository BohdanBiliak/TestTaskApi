import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add-user')
  async addUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('get-user/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('get-users')
  async getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.getUsers(getUsersDto);
  }
}
