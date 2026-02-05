import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);
  private readonly TOTAL_USERS = 2_000_000;
  private readonly BATCH_SIZE = 5000;
  private userCounter = 0;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase(): Promise<void> {
    try {
      this.logger.log('Checking database status...');
      const count = await this.userModel.countDocuments().exec();
      this.logger.log(`Found ${count} users in database`);

      if (count === 0) {
        this.logger.log('Creating test user for Swagger authentication...');
        await this.userModel.create({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+380123456789',
          birthDate: new Date('1990-01-15'),
          createdAt: new Date(),
        });
        this.logger.log(
          'Test user created. Login credentials: email=test@example.com, phone=+380123456789',
        );

        this.logger.log(
          `Starting background seed of ${this.TOTAL_USERS} additional users...`,
        );

        this.generateUsersInBackground().catch((error) => {
          this.logger.error('Error during background seeding', error.stack);
        });

        this.logger.log('Seed process started in background. API is ready.');
      } else {
        this.logger.log(
          `Database already contains ${count} users. Skipping seed.`,
        );
      }
    } catch (error) {
      this.logger.error('Error checking database status', error.stack);
    }
  }

  private async generateUsersInBackground(): Promise<void> {
    const startTime = Date.now();
    let insertedCount = 0;

    const batches = Math.ceil(this.TOTAL_USERS / this.BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const batchStartTime = Date.now();
      const users = this.generateUserBatch(this.BATCH_SIZE);

      await this.userModel.insertMany(users, { ordered: false });

      insertedCount += users.length;
      const progress = ((insertedCount / this.TOTAL_USERS) * 100).toFixed(2);
      const batchTime = Date.now() - batchStartTime;

      this.logger.log(
        `Inserted batch ${batch + 1}/${batches} (${insertedCount}/${this.TOTAL_USERS} users, ${progress}%) in ${batchTime}ms`,
      );

      await this.sleep(10);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    this.logger.log(
      `Successfully seeded ${insertedCount} users in ${totalTime}s`,
    );
  }

  private generateUserBatch(size: number): Partial<User>[] {
    const users: Partial<User>[] = [];
    const now = new Date();

    for (let i = 0; i < size; i++) {
      users.push({
        name: this.generateRandomName(),
        email: this.generateRandomEmail(),
        phone: this.generateRandomPhone(),
        birthDate: this.generateRandomBirthDate(),
        createdAt: now,
      });
    }

    return users;
  }

  private generateRandomName(): string {
    const firstNames = [
      'John',
      'Jane',
      'Michael',
      'Emily',
      'David',
      'Sarah',
      'James',
      'Emma',
      'Robert',
      'Olivia',
      'William',
      'Sophia',
      'Richard',
      'Ava',
      'Joseph',
      'Isabella',
      'Thomas',
      'Mia',
      'Charles',
      'Charlotte',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
      'Hernandez',
      'Lopez',
      'Gonzalez',
      'Wilson',
      'Anderson',
      'Thomas',
      'Taylor',
      'Moore',
      'Jackson',
      'Martin',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomSuffix = Math.floor(Math.random() * 1000000);

    return `${firstName} ${lastName} ${randomSuffix}`;
  }

  private generateRandomEmail(): string {
    return `user${this.userCounter++}@example.com`;
  }

  private generateRandomPhone(): string {
    const phoneNumber = String(this.userCounter).padStart(10, '0');
    return `+380${phoneNumber.slice(-9)}`;
  }

  private generateRandomBirthDate(): Date {
    const start = new Date(1950, 0, 1);
    const end = new Date(2005, 11, 31);
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
