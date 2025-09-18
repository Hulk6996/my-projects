import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitationCodeDto } from './create-invitation_code.dto';

export class UpdateInvitationCodeDto extends PartialType(CreateInvitationCodeDto) {}
