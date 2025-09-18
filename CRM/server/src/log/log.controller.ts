import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLogs() {
    return this.logService.getLogs();
  }
}