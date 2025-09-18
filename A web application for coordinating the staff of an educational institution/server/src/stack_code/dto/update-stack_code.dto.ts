import { PartialType } from '@nestjs/mapped-types';
import { CreateStackCodeDto } from './create-stack_code.dto';

export class UpdateStackCodeDto extends PartialType(CreateStackCodeDto) {}
