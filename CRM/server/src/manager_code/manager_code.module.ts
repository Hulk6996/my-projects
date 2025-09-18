import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerCodeService } from './manager_code.service';
import { ManagerCode } from './entities/manager_code.entity';
import { LogModule } from 'src/log/log.module';
import { ManagerCodeController } from './manager_code.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManagerCode]), 
    LogModule,
  ],
  providers: [ManagerCodeService],
  exports: [ManagerCodeService],
  controllers: [ManagerCodeController]
})
export class ManagerCodeModule {}