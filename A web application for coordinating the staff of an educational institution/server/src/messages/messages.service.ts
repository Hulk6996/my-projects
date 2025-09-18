import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = this.messageRepository.create({
      sender_id: createMessageDto.authorId,
      text_message: createMessageDto.text,
      date_and_time_sending: new Date(),
    });

    await this.messageRepository.save(newMessage);

    return this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'user')
      .where('message.message_id = :id', { id: newMessage.message_id })
      .select([
        'message.message_id',
        'message.text_message',
        'message.date_and_time_sending',
        'user.id',
        'user.name',
        'user.surname',
      ])
      .getOne();
  }

  async findAll(): Promise<any[]> {
    this.logger.log('Retrieving all messages with sender information');
  
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'user')
      .select([
        'message.message_id',
        'message.text_message',
        'message.date_and_time_sending',
        'user.id',
        'user.name', 
        'user.surname',
      ])
      .getMany();
      
    return messages;
  }

  async delete(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }

  async update(id: number, newText: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { message_id: id } });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    message.text_message = newText;
    await this.messageRepository.save(message);

    return message;
}

}
