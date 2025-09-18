import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ManagerCodeModule } from './manager_code/manager_code.module';
import { EmployeeCodeModule } from './employee_code/employee_code.module';
import { CommentsModule } from './comments/comments.module';
import { TasksModule } from './tasks/tasks.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12345',
        database: 'crm',
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        "migrations": ["src/migrations/*.ts"],
        "cli": {
          "migrationsDir": "src/migrations" 
        }
      }), 
      inject: [ConfigService],
    }),
    UsersModule,
    ManagerCodeModule,
    EmployeeCodeModule,
    CommentsModule,
    TasksModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
