import { Test, TestingModule } from '@nestjs/testing';
import { SucribtionCardsService } from './sucribtion-cards.service';

describe('SucribtionCardsService', () => {
  let service: SucribtionCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SucribtionCardsService],
    }).compile();

    service = module.get<SucribtionCardsService>(SucribtionCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
