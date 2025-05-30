import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'StrongPassword123!' })
    @IsString()
    @IsNotEmpty()
    password: string
}
