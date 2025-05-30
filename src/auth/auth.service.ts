import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        return this.usersService.validateUser(email, password)
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken: this.jwtService.sign(payload),
        }
    }

    async validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token)
        } catch (error) {
            return null
        }
    }
}
