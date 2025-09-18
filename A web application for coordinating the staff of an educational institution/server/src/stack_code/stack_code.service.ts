import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackCode } from './entities/stack_code.entity';
import { CreateStackCodeDto } from './dto/create-stack_code.dto';
import { UpdateStackCodeDto } from './dto/update-stack_code.dto';

const logger = new Logger('StackCodesService');

@Injectable()
export class StackCodeService {
    constructor(
        @InjectRepository(StackCode)
        private readonly stackCodeRepository: Repository<StackCode>,
    ) {}

    async createStackCode(createStackCodeDto: CreateStackCodeDto): Promise<StackCode> {
        try {
            const generatedCode = this.generateRandomCode(10);
            
            const stackCode = this.stackCodeRepository.create({
                ...createStackCodeDto,
                code: generatedCode,
                isActive: true,
            });
            const savedStackCode = await this.stackCodeRepository.save(stackCode);
            logger.log(`Created StackCode with ID ${savedStackCode.id}`);
            return savedStackCode;
        } catch (error) {
            logger.error(`Error creating StackCode: ${error.message}`);
            throw error;
        }
    }

    private generateRandomCode(length: number): string {
        const characters = '0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;
    }
    

    async findAllStackCodes(): Promise<StackCode[]> {
        return this.stackCodeRepository.find();
    }

    async findOneStackCode(id: number): Promise<StackCode> {
        try {
            const stackCode = await this.stackCodeRepository.findOne({ where: { id } });
            if (!stackCode) {
                throw new NotFoundException(`StackCode with ID ${id} not found`);
            }
            return stackCode;
        } catch (error) {
            logger.error(`Error finding StackCode with ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async updateStackCode(id: number, updateStackCodeDto: UpdateStackCodeDto): Promise<StackCode> {
        const stackCode = await this.stackCodeRepository.findOne({ where: { id } });
        if (!stackCode) {
            throw new NotFoundException(`StackCode with ID ${id} not found`);
        }

        
        if (updateStackCodeDto.code) {
          stackCode.code = updateStackCodeDto.code;
        }

        return this.stackCodeRepository.save(stackCode);
    }

    async removeStackCode(id: number): Promise<void> {
        const result = await this.stackCodeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`StackCode with ID ${id} not found`);
        }
    }
}



