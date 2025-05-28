import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, ValidateNested, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ProgramLevel, SubscriptionType } from '../entities/sucribtion.entity'
import { CreateClientDto } from 'src/clients/dto/create-client.dto'
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto'

export class CreateSucribtionDto {
    @ApiProperty({ enum: SubscriptionType })
    @IsEnum(SubscriptionType)
    @IsNotEmpty()
    subscription_type: SubscriptionType

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => CreateClientDto)
    @ValidateNested()
    client: CreateClientDto

    @ApiProperty({ enum: ProgramLevel })
    @IsEnum(ProgramLevel)
    @IsNotEmpty()
    program_level: ProgramLevel

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    program_id: number

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    // @Min(Date.now(), { message: 'Start date must be in the future' })
    start_date: Date

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => CreatePaymentDto)
    @ValidateNested()
    payment: CreatePaymentDto
}
