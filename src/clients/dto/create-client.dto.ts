import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { BloodGroup } from '../entities/client.entity'
import { Transform } from 'class-transformer'

export class CreateClientDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date_of_birth: Date

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    urgent_contact_full_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    urgent_contact_phone: string

    @ApiProperty({ enum: BloodGroup })
    @IsEnum(BloodGroup)
    @IsNotEmpty()
    blood_group: BloodGroup
}
