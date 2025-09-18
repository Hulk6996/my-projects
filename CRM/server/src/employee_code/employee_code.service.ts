import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeCode } from './entities/employee_code.entity';
import { CreateEmployeeCodeDto } from './dto/create-employee_code.dto';
import { LogService } from '../log/log.service';

const logger = new Logger('EmployeeCodeService');

@Injectable()
export class EmployeeCodeService {
  constructor(
    @InjectRepository(EmployeeCode)
    private readonly employeeCodeRepository: Repository<EmployeeCode>,
    private logService: LogService
  ) {}

  async createEmployeeCode(createEmployeeCodeDto: CreateEmployeeCodeDto): Promise<EmployeeCode> {
    try {
      const generatedCode = this.generateRandomCode(4);

      const employeeCode = this.employeeCodeRepository.create({
        ...createEmployeeCodeDto,
        code: generatedCode,
        isActive: true,
      });
      const savedEmployeeCode = await this.employeeCodeRepository.save(employeeCode);
      await this.logService.createLog(savedEmployeeCode.id, 'Create', `ManagerCode created with ID ${savedEmployeeCode.id}`);
      return savedEmployeeCode;
    } catch (error) {
      logger.error(`Error creating EmployeeCode: ${error.message}`);
      throw error;
    }
  }

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  async findAllEmployeeCodes(): Promise<EmployeeCode[]> {
    return this.employeeCodeRepository.find();
  }

  async findOneEmployeeCode(id: number): Promise<EmployeeCode> {
    const employeeCode = await this.employeeCodeRepository.findOne({ where: { id } });
    if (!employeeCode) {
      throw new NotFoundException(`EmployeeCode with ID ${id} not found`);
    }
    return employeeCode;
  }

  async findActiveCodes(): Promise<EmployeeCode[]> {
    return this.employeeCodeRepository.find({
      where: { isActive: true },
    });
  }
}
