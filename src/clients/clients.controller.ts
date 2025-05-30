import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { ApiBody, ApiOperation } from '@nestjs/swagger'

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @ApiBody({ type: CreateClientDto, required: true })
    @ApiOperation({ summary: 'Create client' })
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto)
    }

    @Get()
    findAll() {
        return this.clientsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(+id, updateClientDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientsService.remove(+id)
    }
}
