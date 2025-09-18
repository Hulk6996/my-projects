import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(scheduleData: {filePath: string }): Promise<Schedule> {
    this.logger.log(`Создание нового расписания`);
  
    const newSchedule = this.scheduleRepository.create({

      filePath: `http://localhost:3001/uploads/${path.basename(scheduleData.filePath)}`, 
    });
  
    const savedSchedule = await this.scheduleRepository.save(newSchedule);
    this.logger.log(`Расписание успешно создано: ${JSON.stringify(savedSchedule)}`);
  
    return savedSchedule;
  }

  async getSchedule(): Promise<string[]> {
    const schedules = await this.scheduleRepository.find();
    if (!schedules || schedules.length === 0) {
      throw new NotFoundException('Расписание не найдено');
    }

    const filePaths = schedules.map(schedule => `http://localhost:3001/uploads/${path.basename(schedule.filePath)}`);
    return filePaths;
  }
  
  async deleteSchedule(): Promise<void> {
    const schedules = await this.scheduleRepository.find();
    if (!schedules || schedules.length === 0) {
      throw new NotFoundException('Нет расписания для удаления');
    }
  
    for (const schedule of schedules) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(schedule.filePath));
      try {
        await fs.unlink(filePath);
        this.logger.log(`Файл расписания успешно удален: ${filePath}`);
      } catch (error) {
        this.logger.error(`Ошибка при удалении файла: ${error.message}`);
      }
    }
  
    await this.scheduleRepository.remove(schedules);
    this.logger.log('Расписания успешно удалены из базы данных');
  } 
  
}