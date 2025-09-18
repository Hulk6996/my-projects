import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Task } from '../tasks/entities/task.entity'; 
import { User } from '../users/entities/user.entity';
import { LogService } from '../log/log.service'; 

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly logService: LogService 
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    console.log("Final check before creation:", createCommentDto);
    const comment = this.commentRepository.create({
      text: createCommentDto.text,
      task: { id: createCommentDto.taskId } as Task,
      user: { id: createCommentDto.userId } as User
    });

    const savedComment = await this.commentRepository.save(comment);
    await this.logService.createLog(userId, 'Create Comment', `User ${userId} created a comment with ID ${savedComment.id} on task ${createCommentDto.taskId}`);
    return savedComment;
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['task', 'user']
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['task', 'user']
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async findByTaskId(taskId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['user', 'task']
    });
  }

  async updateComment(id: number, text: string, userId: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.text = text;
    const updatedComment = await this.commentRepository.save(comment);
    await this.logService.createLog(userId, 'Update Comment', `User ${userId} updated comment ${id}`);
    return updatedComment;
  }

  async removeComment(id: number, userId: number): Promise<void> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
    await this.logService.createLog(userId, 'Delete Comment', `User ${userId} deleted comment ${id}`);
  }
}
