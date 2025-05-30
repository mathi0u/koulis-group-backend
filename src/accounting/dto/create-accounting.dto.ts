import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { AccountingType } from '../entities/accounting.entity'
import { PaymentInfoDto } from './payment-info.dto'

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

    @ApiProperty({ type: () => PaymentInfoDto })
    @ValidateNested()
    @Type(() => PaymentInfoDto)
    payment: PaymentInfoDto
}
