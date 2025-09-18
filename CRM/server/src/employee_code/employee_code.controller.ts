import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmployeeCodeService } from './employee_code.service';
import { CreateEmployeeCodeDto } from './dto/create-employee_code.dto';

@Controller('employee-code')
export class EmployeeCodeController {
  constructor(private readonly employeeCodeService: EmployeeCodeService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeCodeDto: CreateEmployeeCodeDto) {
      console.log('Received request to generate employee code:', createEmployeeCodeDto);
      const employeeCode = await this.employeeCodeService.createEmployeeCode(createEmployeeCodeDto);
      console.log('Generated employee code:', employeeCode);
      return {
          success: true,
          code: employeeCode.code,
          id: employeeCode.id,
          isActive: employeeCode.isActive,
      };
  }
  
  @Get('/active')
  async getActiveCodes() {
    const codes = await this.employeeCodeService.findActiveCodes();
    return codes.map(code => ({
      id: code.id,
      code: code.code,
      isActive: code.isActive
    }));
  }
}
