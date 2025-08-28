import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ScopesModule } from './modules/scopes/scopes.module';
import { UserScopesModule } from './modules/user-scopes/user-scopes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ScopesModule,
    UserScopesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
