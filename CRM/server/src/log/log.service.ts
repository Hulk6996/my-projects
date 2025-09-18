import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async createLog(userId: number, action: string, description: string): Promise<Log> {
    const log = this.logRepository.create({ userId, action, description });
    return this.logRepository.save(log);
  }

  async getLogs(): Promise<Log[]> {
    return this.logRepository.find();
  }
}
