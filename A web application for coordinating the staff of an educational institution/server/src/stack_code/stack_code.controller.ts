import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StackCodeService } from './stack_code.service';
import { CreateStackCodeDto } from './dto/create-stack_code.dto';

@Controller('stackcode')
export class StackCodeController {
  constructor(private readonly stackCodeService: StackCodeService) {}

  @Post('/generate/1')
async create(@Body() createStackCodeDto: CreateStackCodeDto) {
    const stackCode = await this.stackCodeService.createStackCode(createStackCodeDto);
    return {
        success: true,
        code: stackCode.code,
        id: stackCode.id,
        isActive: stackCode.isActive 
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stackCodeService.findOneStackCode(+id);
  }
}


