import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Replacement } from './entities/replacement.entity';
import { ReplacementService } from './replacement.service';
import { ReplacementController } from './replacement.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Replacement]),
    UsersModule,
  ],
  controllers: [ReplacementController],
  providers: [ReplacementService],
  exports: [ReplacementService]
})
export class ReplacementModule {}