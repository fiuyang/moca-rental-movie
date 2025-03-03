import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ExistValidator } from './common/validator/exist.validator';
import { UniqueValidator } from './common/validator/unique.validator';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { RentalModule } from './rental/rental.module';
import { UserModule } from './user/user.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { WebhookModule } from './webhook/webhook.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*.{ts,.js}'],
        migrationsRun: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
        extra: {
          max: configService.get<number>('DB_MAX_CONNECTIONS', 5),
          idleTimeoutMillis: configService.get<number>(
            'DB_IDLE_TIMEOUT',
            30000,
          ),
          connectionTimeoutMillis: configService.get<number>(
            'DB_CONNECTION_TIMEOUT',
            2000,
          ),
        },
      }),
    }),
    GenreModule,
    MovieModule,
    RentalModule,
    UserModule,
    MidtransModule,
    WebhookModule,
    TransactionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [ExistValidator, UniqueValidator],
  exports: [TypeOrmModule],
})
export class AppModule {}
