import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scope } from '../../database/entities/scope.entity';
import { CreateScopeDto } from './dtos/create-scope.dto';
import { ScopeResponseDto } from './dtos/scope-response.dto';
import { UpdateScopeDto } from './dtos/update-scope.dto';

@Injectable()
export class ScopesService {
  constructor(
    @InjectRepository(Scope)
    private scopeRepository: Repository<Scope>,
  ) {}

  public async create(
    createScopeDto: CreateScopeDto,
  ): Promise<ScopeResponseDto> {
    const scope = this.scopeRepository.create(createScopeDto);
    const savedScope = await this.scopeRepository.save(scope);
    return new ScopeResponseDto(savedScope);
  }

  public async findAll(): Promise<ScopeResponseDto[]> {
    const scopes = await this.scopeRepository.find();

    return scopes.map((scope) => new ScopeResponseDto(scope));
  }

  public async findOne(id: number): Promise<ScopeResponseDto> {
    const scope = await this.scopeRepository.findOne({ where: { id } });

    if (!scope) {
      throw new NotFoundException(`Scope with id ${id} not found`);
    }

    return new ScopeResponseDto(scope);
  }

  public async update(
    id: number,
    updateScopeDto: UpdateScopeDto,
  ): Promise<ScopeResponseDto> {
    await this.scopeRepository.update(id, updateScopeDto);
    return await this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const deletedResult = await this.scopeRepository.softDelete(id);

    if (deletedResult.affected === 0) {
      throw new NotFoundException(`Scope with id ${id} not found`);
    }
  }
}
