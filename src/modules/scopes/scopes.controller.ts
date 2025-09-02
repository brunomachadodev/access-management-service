import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { CreateScopeDto } from './dtos/create-scope.dto';
import { UpdateScopeDto } from './dtos/update-scope.dto';
import { ScopesService } from './scopes.service';

@Controller('scopes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Post()
  @UseInterceptors(AuditInterceptor)
  async create(@Body() createScopeDto: CreateScopeDto) {
    return this.scopesService.create(createScopeDto);
  }

  @Get()
  async findAll() {
    return this.scopesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scopesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(AuditInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScopeDto: UpdateScopeDto,
  ) {
    return this.scopesService.update(id, updateScopeDto);
  }

  @Delete(':id')
  @UseInterceptors(AuditInterceptor)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.scopesService.remove(id);
  }
}
