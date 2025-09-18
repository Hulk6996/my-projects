import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { StackCode } from './../stack_code/entities/stack_code.entity';
import { InvitationCode } from './../invitation_codes/entities/invitation_code.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StackCode, InvitationCode]), 
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


