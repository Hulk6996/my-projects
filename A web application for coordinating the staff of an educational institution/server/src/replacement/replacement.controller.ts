import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ReplacementService } from './replacement.service';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { Replacement } from './entities/replacement.entity';

@Controller('replacements')
export class ReplacementController {
  constructor(private readonly replacementService: ReplacementService) {}

  @Get()
  findAll(): Promise<Replacement[]> {
    return this.replacementService.findAll();
  }

  @Get('user/:id')
  findForUser(@Param('id') userId: number): Promise<Replacement[]> {
    return this.replacementService.findForUser(userId);
  }

  @Post()
  create(@Body() createReplacementDto: CreateReplacementDto): Promise<Replacement> {
    return this.replacementService.create(createReplacementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.replacementService.remove(id);
  }
}
