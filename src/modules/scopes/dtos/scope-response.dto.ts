import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScopeResponseDto {
  @Expose()
  id: number;

  @Expose()
  service: string;

  @Expose()
  scope: string;

  @Expose()
  uuid: string;

  constructor(partial: Partial<ScopeResponseDto>) {
    Object.assign(this, partial);
  }
}
