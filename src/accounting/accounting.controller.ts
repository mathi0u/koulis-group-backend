import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AccountingService } from './accounting.service'
import { CreateAccountingDto } from './dto/create-accounting.dto'
import { UpdateAccountingDto } from './dto/update-accounting.dto'

@ApiTags('accounting')
@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new accounting entry' })
    @ApiResponse({ status: 201, description: 'Entry created successfully' })
    create(@Body() createAccountingDto: CreateAccountingDto) {
        return this.accountingService.create(createAccountingDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all accounting entries' })
    findAll() {
        return this.accountingService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an accounting entry by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.accountingService.findOne(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an accounting entry' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAccountingDto: UpdateAccountingDto) {
        return this.accountingService.update(id, updateAccountingDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an accounting entry' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.accountingService.remove(id)
    }

    @Get('transactions')
    @ApiOperation({ summary: 'Get all subscription and product transactions' })
    findAllTransactions() {
        return this.accountingService.findAllTransactions()
    }
}
