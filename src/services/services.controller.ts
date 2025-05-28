import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto)
    }

    @Get()
    findAll() {
        return this.servicesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(+id, updateServiceDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        console.log('id', isNaN(+id), id)
        return this.servicesService.remove(+id)
    }
}
