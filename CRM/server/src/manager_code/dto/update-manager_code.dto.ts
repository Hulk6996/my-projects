import { PartialType } from '@nestjs/mapped-types';
import { CreateManagerCodeDto } from './create-manager_code.dto';

export class UpdateManagerCodeDto extends PartialType(CreateManagerCodeDto) {}
