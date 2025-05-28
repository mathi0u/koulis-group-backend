import { Test, TestingModule } from '@nestjs/testing'
import { SucribtionsService } from './sucribtions.service'

describe('SucribtionsService', () => {
    let service: SucribtionsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SucribtionsService],
        }).compile()

        service = module.get<SucribtionsService>(SucribtionsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
