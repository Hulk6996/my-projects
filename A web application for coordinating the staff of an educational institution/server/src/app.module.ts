import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ProfilePostsModule } from './profile_posts/profile_posts.module';
import { NewsFeedModule } from './news_feed/news_feed.module';
import { InvitationCodesModule } from './invitation_codes/invitation_codes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackCodeModule } from './stack_code/stack_code.module';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from './schedule/schedule.module';
import { ReplacementModule } from './replacement/replacement.module';

@Module({
  imports: [
    UsersModule,
    StackCodeModule,
    MessagesModule,
    ProfilePostsModule, 
    NewsFeedModule, 
    InvitationCodesModule,  
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12345',
        database: 'stack',
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        "migrations": ["src/migrations/*.ts"],
        "cli": {
          "migrationsDir": "src/migrations" 
        }
      }), 
      inject: [ConfigService],
    }),
    ScheduleModule,
    ReplacementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
