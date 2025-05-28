import { Module } from '@nestjs/common';
import { SucribtionCardsService } from './sucribtion-cards.service';
import { SucribtionCardsController } from './sucribtion-cards.controller';

@Module({
  controllers: [SucribtionCardsController],
  providers: [SucribtionCardsService],
})
export class SucribtionCardsModule {}
