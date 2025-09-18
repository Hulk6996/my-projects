import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeCodeDto } from './create-employee_code.dto';

export class UpdateEmployeeCodeDto extends PartialType(CreateEmployeeCodeDto) {}
