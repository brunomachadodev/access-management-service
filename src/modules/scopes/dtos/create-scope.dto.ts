import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScopeDto {
  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsString()
  scope: string;
}
