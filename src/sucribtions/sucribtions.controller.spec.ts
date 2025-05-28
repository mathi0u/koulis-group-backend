import { Test, TestingModule } from '@nestjs/testing'
import { SucribtionsController } from './sucribtions.controller'
import { SucribtionsService } from './sucribtions.service'

describe('SucribtionsController', () => {
    let controller: SucribtionsController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SucribtionsController],
            providers: [SucribtionsService],
        }).compile()

        controller = module.get<SucribtionsController>(SucribtionsController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
