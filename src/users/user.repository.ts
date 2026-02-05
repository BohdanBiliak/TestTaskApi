import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async findWithCursorPagination(
    cursor: string | null,
    limit: number,
    filters?: { name?: string; email?: string; phone?: string },
  ): Promise<User[]> {
    const query: any = cursor ? { _id: { $gt: cursor } } : {};

    if (filters) {
      if (filters.email) {
        query.email = filters.email;
      }
      if (filters.phone) {
        query.phone = filters.phone;
      }
      if (filters.name) {
        query.name = { $regex: new RegExp(filters.name, 'i') };
      }
    }

    return this.userModel.find(query).limit(limit).sort({ _id: 1 }).exec();
  }
}
