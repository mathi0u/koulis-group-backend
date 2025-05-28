import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'
import { SucribtionsService } from './sucribtions.service'
import { CreateSucribtionDto } from './dto/create-sucribtion.dto'
import { UpdateSucribtionDto } from './dto/update-sucribtion.dto'
import { Subscription } from './entities/sucribtion.entity'
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SucribtionsController {
    constructor(private readonly sucribtionsService: SucribtionsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new subscription' })
    @ApiResponse({ status: 201, description: 'Subscription successfully created', type: Subscription })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({
        description: 'Create a new subscription with client and payment details',
        type: CreateSucribtionDto,
        examples: {
            subscription: {
                summary: 'New Subscription',
                value: {
                    subscription_type: 'MENSUELLE',
                    program_id: 3,
                    program_level: 'DEBUTANT',
                    start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow's date
                    client: {
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@example.com',
                        phone: '1234567890',
                        address: '123 Main St',
                        date_of_birth: '1990-01-01',
                        urgent_contact_full_name: 'Jane Doe',
                        urgent_contact_phone: '9876543210',
                        blood_group: 'A_POSITIVE',
                    },
                    payment: {
                        amount: 100,
                        payment_method: 'CASH',
                        payment_date: new Date().toISOString(),
                    },
                },
            },
        },
    })
    create(@Body() createSucribtionDto: CreateSucribtionDto) {
        return this.sucribtionsService.create(createSucribtionDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all subscriptions' })
    @ApiResponse({ status: 200, description: 'Return all subscriptions', type: [Subscription] })
    findAll() {
        return this.sucribtionsService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a subscription by id' })
    @ApiParam({ name: 'id', description: 'Subscription ID' })
    @ApiResponse({ status: 200, description: 'Return the subscription', type: Subscription })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    findOne(@Param('id') id: string) {
        return this.sucribtionsService.findOne(+id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a subscription' })
    @ApiParam({ name: 'id', description: 'Subscription ID' })
    @ApiResponse({ status: 200, description: 'Subscription successfully updated', type: Subscription })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    update(@Param('id') id: string, @Body() updateSucribtionDto: UpdateSucribtionDto) {
        return this.sucribtionsService.update(+id, updateSucribtionDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a subscription' })
    @ApiParam({ name: 'id', description: 'Subscription ID' })
    @ApiResponse({ status: 200, description: 'Subscription successfully deleted' })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    remove(@Param('id') id: string) {
        return this.sucribtionsService.remove(+id)
    }

    @Post('renew/:clientId')
    @ApiOperation({ summary: 'Renew subscription for a client' })
    @ApiParam({ name: 'clientId', description: 'Client ID' })
    @ApiResponse({ status: 201, description: 'Subscription successfully renewed', type: Subscription })
    @ApiResponse({ status: 404, description: 'Client or subscription not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({
        description: 'Payment details for renewal',
        schema: {
            example: {
                amount: 100,
                payment_method: 'CASH',
                payment_date: new Date().toISOString(),
            },
        },
    })
    async renew(@Param('clientId') clientId: string, @Body() payment: CreatePaymentDto) {
        return this.sucribtionsService.renew(+clientId, payment)
    }
}
