import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString, IsDate } from 'class-validator'
import { PaymentMethod } from 'src/payments/entities/payment.entity'
import { Type } from 'class-transformer'

export class PaymentInfoDto {
    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod

    @ApiProperty()
    @IsNumber()
    amount: number

    @ApiProperty({ required: false })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    payment_date?: Date

    @ApiProperty({ required: false, description: 'Optional: Reference to existing subscription in the system' })
    @IsNumber()
    @IsOptional()
    subscription_id?: number

    @ApiProperty({ required: false, description: 'Optional: Reference to existing product in the system' })
    @IsNumber()
    @IsOptional()
    product_id?: number

    @ApiProperty({
        required: false,
        description: 'Optional: External reference or description for payments not tracked by the system',
    })
    @IsString()
    @IsOptional()
    external_reference?: string
}
