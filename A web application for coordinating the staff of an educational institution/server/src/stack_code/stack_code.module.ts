import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackCode } from './entities/stack_code.entity';
import { StackCodeController } from './stack_code.controller'; 
import { StackCodeService } from './stack_code.service';

@Module({
  imports: [TypeOrmModule.forFeature([StackCode])],
  controllers: [StackCodeController], 
  providers: [StackCodeService],
  exports: [StackCodeService],
})
export class StackCodeModule {}