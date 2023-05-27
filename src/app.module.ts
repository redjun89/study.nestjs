import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        retryAttempts: configService.get('NODE_ENV') === 'prod' ? 10 : 1, // 연결에 실패했을 경우, 연결 재시도 횟수를 의미합니다.
        type: 'mysql', // 어떤 DB를 사용할 것인지
        host: configService.get('DB_HOST'), // 우리는 본인 컴퓨터에 설치된 DB를 사용할 것이디 localhost로 설정
        port: Number(configService.get('DB_PORT')),  // MySQL의 기본 포트는 3306 입니다.
        database: configService.get('DB_NAME'),  // 위에서 만든 study 데이터베이스로 설정
        username: configService.get('DB_USER'),  // 설정한 username입력, 기본은 root
        password: configService.get('DB_PASSWORD'), // 설정한 password입력
        entities: [
          path.join(__dirname, '/entities/**/*.entity.{js, ts}'),
        ],
        synchronize: false, // 무조건 false로 해두세요.
        logging: true,  // typeorm 쿼리 실행시, MySQL의 쿼리문을 터미널에 보여줍니다.
        timezone: 'local',
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }