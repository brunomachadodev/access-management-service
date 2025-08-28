import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database.module';
import { Scope } from '../entities/scope.entity';
import { UserScope } from '../entities/user-scope.entity';
import { User } from '../entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Scope, UserScope]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
