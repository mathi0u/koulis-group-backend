import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Public } from '../users/decorator/public.decorator'

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Application is running' })
    healthCheck() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            railway: Boolean(process.env.RAILWAY_STATIC_URL),
        }
    }
}
