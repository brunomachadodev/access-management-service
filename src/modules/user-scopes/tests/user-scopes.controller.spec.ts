import { Test, TestingModule } from '@nestjs/testing';
import { UserScopesController } from './user-scopes.controller';

describe('UserScopesController', () => {
  let controller: UserScopesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserScopesController],
    }).compile();

    controller = module.get<UserScopesController>(UserScopesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
