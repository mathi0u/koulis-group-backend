import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SucribtionCardsService } from './sucribtion-cards.service'
import { CreateSucribtionCardDto } from './dto/create-sucribtion-card.dto'
import { UpdateSucribtionCardDto } from './dto/update-sucribtion-card.dto'

@Controller('sucribtion-cards')
export class SucribtionCardsController {
    constructor(private readonly sucribtionCardsService: SucribtionCardsService) {}

    @Post()
    create(@Body() createSucribtionCardDto: CreateSucribtionCardDto) {
        return this.sucribtionCardsService.create(createSucribtionCardDto)
    }

    @Get()
    findAll() {
        return this.sucribtionCardsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sucribtionCardsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSucribtionCardDto: UpdateSucribtionCardDto) {
        return this.sucribtionCardsService.update(+id, updateSucribtionCardDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sucribtionCardsService.remove(+id)
    }
}
