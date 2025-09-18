import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeCodeService } from './employee_code.service';
import { EmployeeCode } from './entities/employee_code.entity';
import { EmployeeCodeController } from './employee_code.controller';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeCode]), 
    LogModule
  ],
  providers: [EmployeeCodeService],
  exports: [EmployeeCodeService, TypeOrmModule],
  controllers: [EmployeeCodeController],
})
export class EmployeeCodeModule {}
