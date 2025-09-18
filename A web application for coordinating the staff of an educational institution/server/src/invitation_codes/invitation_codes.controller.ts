import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvitationCodeService } from './invitation_codes.service';
import { CreateInvitationCodeDto } from './dto/create-invitation_code.dto';

@Controller('stackcode')
export class InvitationCodeController {
  constructor(private readonly invitationCodeService: InvitationCodeService) {}

  @Post('/generate/2')
  async create(@Body() createInvitationCodeDto: CreateInvitationCodeDto) {
    const invitationCode = await this.invitationCodeService.createInvitationCode(createInvitationCodeDto);
    return {
      success: true,
      code: invitationCode.code,
      id: invitationCode.id,
      isActive: invitationCode.isActive, 
    };
  }
}