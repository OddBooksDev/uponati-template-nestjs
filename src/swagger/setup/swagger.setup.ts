import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerDescription } from './description.swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setVersion('Development')
    // .addBearerAuth({ type: 'http', scheme: 'bearer', name: 'AccessToken', in: 'header' }, 'AccessToken') // if you want to use AccessToken
    .addBearerAuth({ type: 'http', scheme: 'bearer', name: 'RefreshToken', in: 'header' }, 'RefreshToken') // if you want to use RefreshToken
    .setTitle('your_service_name')
    .setDescription(SwaggerDescription)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
