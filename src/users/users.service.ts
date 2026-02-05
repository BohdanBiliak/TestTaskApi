import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      birthDate: new Date(createUserDto.birthDate),
    });

    console.log(`Created user with id: ${user._id}`);

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getUsers(getUsersDto: GetUsersDto) {
    const { cursor, limit = 10, name, email, phone } = getUsersDto;

    const filters = { name, email, phone };

    const users = await this.userRepository.findWithCursorPagination(
      cursor || null,
      limit,
      filters,
    );

    const nextCursor =
      users.length === limit ? users[users.length - 1]._id : null;

    return {
      users,
      nextCursor,
      hasMore: users.length === limit,
    };
  }
}
