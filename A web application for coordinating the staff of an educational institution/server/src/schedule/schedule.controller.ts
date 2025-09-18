import { Controller, Post, Get, Delete, UseGuards, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import { multerConfig } from './multer.config';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    const { text, userId } = body;
    if (!file) {
      return res.status(400).json({ message: 'Отсутствуют обязательные данные: userId, text или file' });
    }
    try {
      const schedule = await this.scheduleService.create({
        filePath: file ? file.filename : ''
      });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании расписания', error: error.message });
    }
  }

  @Get('download')
  @UseGuards(JwtAuthGuard)
  async get(@Res() res: Response) {
    try {
      const filePaths = await this.scheduleService.getSchedule();
      res.json(filePaths);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@Res() res: Response) {
    try {
      await this.scheduleService.deleteSchedule();
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

