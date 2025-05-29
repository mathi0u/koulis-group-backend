import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
//import helmet from '@fastify/helmet';

declare const module: any

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule)

    // Configure CORS to allow connections from frontend
    const corsOrigins = ['http://localhost:4200', 'https://koulis-group-frontend-production.up.railway.app']

    // Add Railway deployments URLs
    if (process.env.RAILWAY_STATIC_URL) {
        corsOrigins.push(process.env.RAILWAY_STATIC_URL)
    }

    // Add custom frontend URL if specified
    if (process.env.FRONTEND_URL) {
        corsOrigins.push(process.env.FRONTEND_URL)
    }

    // Remove any undefined/empty values
    const allowedOrigins = corsOrigins.filter(Boolean)

    console.log('CORS origins:', allowedOrigins)

    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    })

    // await app.register(helmet);

    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe())

    const config = new DocumentBuilder()
        .setTitle('Backend documentation')
        .setDescription('Swagger documentation of the backend API')
        .setVersion('1.0')
        .addTag('back')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)

    // For Railway deployment, we want to listen on 0.0.0.0 to accept connections on all network interfaces
    const port = process.env.PORT || 8080
    const host = '0.0.0.0'

    await app.listen(port, host)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }

    const appUrl = await app.getUrl()
    console.log(`\nApplication running on: ${appUrl}`)
    console.log(`Use swagger to learn how to use the API: ${appUrl}/swagger`)
    console.log(`Health check endpoint: ${appUrl}/api/health`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Railway deployment: ${Boolean(process.env.RAILWAY_STATIC_URL)}`)
    console.log(`Host configuration: ${host}:${port}`)
}

bootstrap()
