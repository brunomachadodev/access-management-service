import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scope, User, UserScope } from 'src/database/entities';
import { UserScopesController } from './user-scopes.controller';
import { UserScopesService } from './user-scopes.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserScope, User, Scope])],
  controllers: [UserScopesController],
  providers: [UserScopesService],
})
export class UserScopesModule {}
