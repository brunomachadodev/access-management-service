import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserScopeDto {
  @IsInt()
  @IsNotEmpty()
  scopeId: number;
}
