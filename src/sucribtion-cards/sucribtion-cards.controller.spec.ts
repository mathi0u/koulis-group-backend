import { Test, TestingModule } from '@nestjs/testing';
import { SucribtionCardsController } from './sucribtion-cards.controller';
import { SucribtionCardsService } from './sucribtion-cards.service';

describe('SucribtionCardsController', () => {
  let controller: SucribtionCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SucribtionCardsController],
      providers: [SucribtionCardsService],
    }).compile();

    controller = module.get<SucribtionCardsController>(SucribtionCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
