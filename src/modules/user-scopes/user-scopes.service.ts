import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Scope } from '../../database/entities/scope.entity';
import { UserScope } from '../../database/entities/user-scope.entity';
import { User } from '../../database/entities/user.entity';
import { CreateUserScopeDto } from './dto/create-user-scope.dto';

@Injectable()
export class UserScopesService {
  constructor(
    @InjectRepository(UserScope)
    private readonly userScopeRepository: Repository<UserScope>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
  ) {}

  async associateScopeToUser(
    userId: number,
    createUserScopeDto: CreateUserScopeDto,
  ): Promise<UserScope> {
    const { scopeId } = createUserScopeDto;

    const user = await this.userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found.`);
    }

    const scope = await this.scopeRepository.findOne({
      where: { id: scopeId, deleted_at: IsNull() },
    });
    if (!scope) {
      throw new NotFoundException(`Scope ${scopeId} not found.`);
    }

    const existingAssociation = await this.userScopeRepository.findOne({
      where: { user_id: userId, scope_id: scopeId },
      withDeleted: true,
    });

    if (existingAssociation) {
      if (existingAssociation.deleted_at === null) {
        throw new ConflictException(
          `Scope ${scopeId} already associated to user ${userId}.`,
        );
      }

      existingAssociation.deleted_at = null;
      existingAssociation.updated_at = new Date();
      return this.userScopeRepository.save(existingAssociation);
    }

    const newUserScope = this.userScopeRepository.create({
      user_id: userId,
      scope_id: scopeId,
      created_at: new Date(),
    });

    return this.userScopeRepository.save(newUserScope);
  }

  async listScopesForUser(userId: number): Promise<UserScope[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deleted_at: IsNull() },
    });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found.`);
    }

    return this.userScopeRepository.find({
      where: {
        user_id: userId,
        deleted_at: IsNull(),
      },
    });
  }

  async removeScopeFromUser(userId: number, scopeId: number): Promise<void> {
    const association = await this.userScopeRepository.findOne({
      where: {
        user_id: userId,
        scope_id: scopeId,
        deleted_at: IsNull(),
      },
    });

    if (!association) {
      throw new NotFoundException(
        `Association between user ${userId} and scope ${scopeId} not found.`,
      );
    }

    await this.userScopeRepository.update(
      { user_id: userId, scope_id: scopeId },
      { deleted_at: new Date() },
    );
  }
}
