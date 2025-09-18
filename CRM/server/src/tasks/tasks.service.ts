import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { LogService } from '../log/log.service'; 
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logService: LogService 
  ) {}

  async createTask(createTaskDto: any, userId: number, file: Express.Multer.File): Promise<Task> {
    const { title, price, description } = createTaskDto;
    let filePath = null;

    if (file) {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.docx'].includes(fileExtension)) {
        throw new BadRequestException('Invalid file type');
      }
      
      const filename = `${Date.now()}-${file.originalname}`;
      const targetPath = path.join(__dirname, '../../uploads', filename);
      
      await fs.writeFile(targetPath, file.buffer);
      filePath = `http://localhost:3001/uploads/${filename}`;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.tasksRepository.create({
      title,
      price,
      description,
      filePath,
      user,
      status: TaskStatus.Incoming
    });

    const savedTask = await this.tasksRepository.save(task);
    await this.logService.createLog(userId, 'Create Task', `Task ${savedTask.id} created by user ${userId}`);

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user', 'comments'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: +id },
      relations: ['user', 'comments']
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: number, updateTaskDto: any, userId: number): Promise<Task> {
    const task = await this.findOne(id);
    task.title = updateTaskDto.title || task.title;
    task.price = updateTaskDto.price || task.price;
    task.description = updateTaskDto.description || task.description;
    task.status = updateTaskDto.status || task.status;

    const updatedTask = await this.tasksRepository.save(task);
    await this.logService.createLog(userId, 'Update Task', `Task ${task.id} updated by user ${userId}`);

    return updatedTask;
  }

  async removeTask(id: number, userId: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
    await this.logService.createLog(userId, 'Delete Task', `Task ${id} deleted by user ${userId}`);
  }

  async findByClient(clientId: number): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: clientId } },
      relations: ['user', 'comments']
    });
    if (!tasks) {
      throw new NotFoundException('No tasks found for this client');
    }
    return tasks;
  }
  
}
