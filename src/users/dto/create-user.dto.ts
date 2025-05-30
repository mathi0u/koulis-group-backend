import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string

    @ApiProperty({ example: 'StrongPassword123!' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsNotEmpty()
    password: string

    @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole
}
