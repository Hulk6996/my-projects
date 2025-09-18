import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Get('by-task/:taskId')
  findCommentsByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTaskId(+taskId);
  }
}
