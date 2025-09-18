import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagerCode } from './entities/manager_code.entity';
import { CreateManagerCodeDto } from './dto/create-manager_code.dto';
import { LogService } from '../log/log.service';

@Injectable()
export class ManagerCodeService {
  private readonly logger = new Logger(ManagerCodeService.name);

  constructor(
    @InjectRepository(ManagerCode)
    private readonly managerCodeRepository: Repository<ManagerCode>,
    private logService: LogService
  ) {}

  async createManagerCode(createManagerCodeDto: CreateManagerCodeDto): Promise<ManagerCode> {
    const generatedCode = this.generateRandomCode(4);
    const managerCode = this.managerCodeRepository.create({
      ...createManagerCodeDto,
      code: generatedCode,
      isActive: true,
    });
    const savedManagerCode = await this.managerCodeRepository.save(managerCode);
    await this.logService.createLog(savedManagerCode.id, 'Create', `ManagerCode created with ID ${savedManagerCode.id}`);
    return savedManagerCode;
  }

  async findOneManagerCode(id: number): Promise<ManagerCode> {
    const managerCode = await this.managerCodeRepository.findOne({where: {id: id}});
    if (!managerCode) {
      throw new NotFoundException(`ManagerCode with ID ${id} not found`);
    }
    return managerCode;
  }

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async findActiveCodes(): Promise<ManagerCode[]> {
    return this.managerCodeRepository.find({
      where: { isActive: true },
    });
  }
}
