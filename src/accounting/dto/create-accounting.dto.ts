import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AccountingType } from '../entities/accounting.entity'

export class CreateAccountingDto {
    @ApiProperty({ enum: AccountingType })
    @IsEnum(AccountingType)
    type: AccountingType

    @ApiProperty()
    @IsNumber()
    amount: number

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsNumber()
    payment_id: number
}
