import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { ManagerCode } from './../manager_code/entities/manager_code.entity';
import { EmployeeCode } from './../employee_code/entities/employee_code.entity'; 
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ManagerCode, EmployeeCode]), 
    LogModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}


