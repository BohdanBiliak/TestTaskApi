import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MongooseModule.forRoot(config.mongodb.uri), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
