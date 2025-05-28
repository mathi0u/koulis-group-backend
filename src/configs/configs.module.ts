import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET') || 'myjwtsecret',
                signOptions: {
                    expiresIn: '12h',
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRESQL_HOST') || 'localhost',
                port: configService.get<number>('POSTGRESQL_PORT') || 5432,
                username: configService.get<string>('POSTGRESQL_USER') || 'user',
                password: configService.get<string>('POSTGRESQL_PASSWORD') || 'password',
                database: configService.get<string>('POSTGRESQL_DB') || 'kg',
                synchronize: true,
                logging: ['query', 'error', 'schema'],
                entities: ['dist/**/*.entity{.ts,.js}'],
                autoLoadEntities: true,
            }),
        }),
    ],
    exports: [JwtModule],
})
export class ConfigsModule {}
