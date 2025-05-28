import { ApiProperty } from '@nestjs/swagger'
import { PaymentMethod } from '../entities/payment.entity'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Subscription } from 'src/sucribtions/entities/sucribtion.entity'
import { Expose } from 'class-transformer'

export class CreatePaymentDto {
    @ApiProperty({
        default: PaymentMethod.CASH,
    })
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @ApiProperty({ type: () => Subscription })
    @Expose({ toPlainOnly: false })
    subscription: Subscription
}
