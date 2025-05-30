import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigsModule } from '../configs/configs.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigsModule, // Import to get access to JwtModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
