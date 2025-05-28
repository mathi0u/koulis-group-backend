import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
//import helmet from '@fastify/helmet';

declare const module: any

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule)

    app.enableCors({
        origin: ['http://localhost:4200'],
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

    await app.listen(process.env.PORT ?? 8080, process.env.ADDRESS ?? 'localhost')

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }

    console.log(`\nUse swagger to learn how to use the API: ${await app.getUrl()}/swagger`)
}

bootstrap()
