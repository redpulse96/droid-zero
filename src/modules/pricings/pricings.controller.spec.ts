import { Test, TestingModule } from '@nestjs/testing';
import { PricingsController } from './pricings.controller';

describe('Pricings Controller', () => {
  let controller: PricingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingsController],
    }).compile();

    controller = module.get<PricingsController>(PricingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
