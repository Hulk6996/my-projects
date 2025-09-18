import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.messagesService.delete(id);
    return { message: 'Message deleted successfully' };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body('text') newText: string) {
    return this.messagesService.update(id, newText);
  }
}
