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
      limit + 1,
      filters,
    );

    const hasMore = users.length > limit;
    
    const resultUsers = hasMore ? users.slice(0, limit) : users;
    const nextCursor = hasMore ? users[limit - 1]._id : null;

    return {
      users: resultUsers,
      nextCursor,
      hasMore,
    };
  }
}
