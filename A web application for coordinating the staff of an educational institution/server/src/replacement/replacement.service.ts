import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Replacement } from './entities/replacement.entity';
import { CreateReplacementDto } from './dto/create-replacement.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReplacementService {
  constructor(
    @InjectRepository(Replacement)
    private readonly replacementRepository: Repository<Replacement>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<Replacement[]> {
    return await this.replacementRepository.find({ relations: ['selectedTeacher', 'replacementTeacher'] });
  }

  async findForUser(userId: number): Promise<Replacement[]> {
    return await this.replacementRepository.find({
      where: [
        { selectedTeacherId: userId },
        { replacementTeacherId: userId }
      ],
      relations: ['selectedTeacher', 'replacementTeacher']
    });
  }

  async create(createReplacementDto: CreateReplacementDto): Promise<Replacement> {
    const { selectedTeacherId, replacementTeacherId, ...rest } = createReplacementDto;

    const selectedTeacher = await this.userService.findOneById(selectedTeacherId);
    const replacementTeacher = await this.userService.findOneById(replacementTeacherId);

    if (!selectedTeacher || !replacementTeacher) {
      throw new NotFoundException('One or both teachers not found');
    }

    const replacement = this.replacementRepository.create({
      ...rest,
      selectedTeacherId,
      replacementTeacherId,
      selectedTeacher,
      replacementTeacher,
    });

    return await this.replacementRepository.save(replacement);
  }

  async remove(id: number): Promise<void> {
    const result = await this.replacementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Replacement with ID "${id}" not found`);
    }
  }
}

