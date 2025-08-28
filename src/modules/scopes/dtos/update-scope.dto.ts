import { IsOptional, IsString } from 'class-validator';
import { IsNotEmptyObject } from 'src/common/validators/is-not-empty-object.validator';

@IsNotEmptyObject()
export class UpdateScopeDto {
  @IsString()
  @IsOptional()
  service?: string;

  @IsString()
  @IsOptional()
  scope?: string;
}
