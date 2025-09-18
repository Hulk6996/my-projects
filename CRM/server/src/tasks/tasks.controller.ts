import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './custom_decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser('id') userId: number, @UploadedFile() file: Express.Multer.File) {
    return await this.tasksService.createTask(createTaskDto, userId, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(+id);
  }

  @Get('by-client/:clientId')
  @UseGuards(JwtAuthGuard)
  async findByClient(@Param('clientId') clientId: string) {
    return await this.tasksService.findByClient(+clientId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser('id') userId: number) {
    return await this.tasksService.updateTask(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeTask(@Param('id') id: string, @GetUser('id') userId: number) {
    return await this.tasksService.removeTask(+id, userId);
  }
}
