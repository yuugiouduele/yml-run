import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthController } from './auth/auth.controller';
import { TwoFactorService } from './auth/twofactor.service';
import { MailService } from './auth/mail.service';
import {TypeOrmModule} from '@nestjs/typeorm'


@Module({
  imports: [],
  controllers: [AppController,AuthController],
  providers: [AppService,TwoFactorService,MailService],
})

// app.module.tsなどにThrottlerModuleを登録


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
  ],
})

export class AppModule {}
