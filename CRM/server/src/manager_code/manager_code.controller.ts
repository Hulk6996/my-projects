import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ManagerCodeService } from './manager_code.service';
import { CreateManagerCodeDto } from './dto/create-manager_code.dto';

@Controller('manager-code')
export class ManagerCodeController {
  constructor(private readonly managerCodeService: ManagerCodeService) {}

  @Post('/generate')
  async create(@Body() createManagerCodeDto: CreateManagerCodeDto) {
    const managerCode = await this.managerCodeService.createManagerCode(createManagerCodeDto);
    return {
        success: true,
        code: managerCode.code,
        id: managerCode.id,
        isActive: managerCode.isActive 
    };
  }

  @Get('/active')
  async getActiveCodes() {
    const codes = await this.managerCodeService.findActiveCodes();
    return codes.map(code => ({
      id: code.id,
      code: code.code,
      isActive: code.isActive
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.managerCodeService.findOneManagerCode(+id);
  }
}
