import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { CreateUserScopeDto } from './dto/create-user-scope.dto';
import { UserScopeResponseDto } from './dto/user-scope-response.dto';
import { UserScopesService } from './user-scopes.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class UserScopesController {
  constructor(private readonly userScopesService: UserScopesService) {}

  @Get(':userId/scopes')
  async listScopesForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserScopeResponseDto[]> {
    return this.userScopesService.listScopesForUser(userId);
  }

  @Post(':userId/scopes')
  @UseInterceptors(AuditInterceptor)
  async associateScopeToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createUserScopeDto: CreateUserScopeDto,
  ): Promise<UserScopeResponseDto> {
    return this.userScopesService.associateScopeToUser(
      userId,
      createUserScopeDto,
    );
  }

  @Delete(':userId/scopes/:scopeId')
  @UseInterceptors(AuditInterceptor)
  async removeScopeFromUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('scopeId', ParseIntPipe) scopeId: number,
  ): Promise<void> {
    return this.userScopesService.removeScopeFromUser(userId, scopeId);
  }
}
