import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationCode } from './entities/invitation_code.entity';
import { InvitationCodeService } from './invitation_codes.service';
import { InvitationCodeController } from './invitation_codes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationCode])],
  providers: [InvitationCodeService],
  controllers: [InvitationCodeController],
  exports: [InvitationCodeService],
})
export class InvitationCodesModule {}