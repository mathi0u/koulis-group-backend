import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'
import { ProgramLevel, SubscriptionType, SubscriptionStatus } from '../entities/sucribtion.entity'

export class UpdateSucribtionDto {
    @ApiProperty({ enum: SubscriptionType, required: false })
    @IsEnum(SubscriptionType)
    @IsOptional()
    subscription_type?: SubscriptionType

    @ApiProperty({ enum: ProgramLevel, required: false })
    @IsEnum(ProgramLevel)
    @IsOptional()
    program_level?: ProgramLevel

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    program_id?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    start_date?: Date

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    end_date?: Date

    @ApiProperty({ enum: SubscriptionStatus, required: false })
    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    discount?: number
}
