import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Scope } from '../entities/scope.entity';
import { UserScope } from '../entities/user-scope.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
    @InjectRepository(UserScope)
    private readonly userScopeRepository: Repository<UserScope>,
  ) {}

  async seed() {
    await this.seedScopes();
    await this.seedUsers();
    await this.seedUserScopes();
  }

  private async seedScopes() {
    const scopes = [
      {
        service: 'auth',
        scope: 'read',
        uuid: uuidv4(),
      },
      {
        service: 'auth',
        scope: 'write',
        uuid: uuidv4(),
      },
      {
        service: 'users',
        scope: 'read',
        uuid: uuidv4(),
      },
      {
        service: 'users',
        scope: 'write',
        uuid: uuidv4(),
      },
    ];

    for (const scope of scopes) {
      const existingScope = await this.scopeRepository.findOne({
        where: { service: scope.service, scope: scope.scope },
      });

      if (!existingScope) {
        await this.scopeRepository.save(scope);
      }
    }
  }

  private async seedUsers() {
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        roles: ['ROLE_ADMIN'],
        password: 'admin123',
      },
      {
        username: 'user',
        email: 'user@example.com',
        roles: ['ROLE_USER'],
        password: 'user123',
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (!existingUser) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user = new User();
        user.username = userData.username;
        user.username_canonical = userData.username.toLowerCase();
        user.email = userData.email;
        user.email_canonical = userData.email.toLowerCase();
        user.enabled = true;
        user.salt = salt;
        user.password = hashedPassword;
        user.roles = userData.roles;
        user.uuid = uuidv4();

        await this.userRepository.save(user);
      }
    }
  }

  private async seedUserScopes() {
    const admin = await this.userRepository.findOne({
      where: { username: 'admin' },
    });
    const user = await this.userRepository.findOne({
      where: { username: 'user' },
    });
    const scopes = await this.scopeRepository.find();

    if (admin) {
      for (const scope of scopes) {
        const existingUserScope = await this.userScopeRepository.findOne({
          where: { user_id: admin.id, scope_id: scope.id },
        });

        if (!existingUserScope) {
          const userScope = new UserScope();
          userScope.user_id = admin.id;
          userScope.scope_id = scope.id;
          await this.userScopeRepository.save(userScope);
        }
      }
    }

    if (user) {
      const readScopes = scopes.filter((scope) => scope.scope === 'read');
      for (const scope of readScopes) {
        const existingUserScope = await this.userScopeRepository.findOne({
          where: { user_id: user.id, scope_id: scope.id },
        });

        if (!existingUserScope) {
          const userScope = new UserScope();
          userScope.user_id = user.id;
          userScope.scope_id = scope.id;
          await this.userScopeRepository.save(userScope);
        }
      }
    }
  }
}
