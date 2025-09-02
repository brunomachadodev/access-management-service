import { Test, TestingModule } from '@nestjs/testing';
import { UserScopesService } from './user-scopes.service';

describe('UserScopesService', () => {
  let service: UserScopesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScopesService],
    }).compile();

    service = module.get<UserScopesService>(UserScopesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
