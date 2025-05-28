import { Injectable } from '@nestjs/common';
import { CreateSucribtionCardDto } from './dto/create-sucribtion-card.dto';
import { UpdateSucribtionCardDto } from './dto/update-sucribtion-card.dto';

@Injectable()
export class SucribtionCardsService {
  create(createSucribtionCardDto: CreateSucribtionCardDto) {
    return 'This action adds a new sucribtionCard';
  }

  findAll() {
    return `This action returns all sucribtionCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucribtionCard`;
  }

  update(id: number, updateSucribtionCardDto: UpdateSucribtionCardDto) {
    return `This action updates a #${id} sucribtionCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucribtionCard`;
  }
}
