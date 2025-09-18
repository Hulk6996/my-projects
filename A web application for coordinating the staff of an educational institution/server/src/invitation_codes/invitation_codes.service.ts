import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationCode } from './entities/invitation_code.entity';
import { CreateInvitationCodeDto } from './dto/create-invitation_code.dto';
import { UpdateInvitationCodeDto } from './dto/update-invitation_code.dto';

const logger = new Logger('InvitationCodeService');

@Injectable()
export class InvitationCodeService {
  constructor(
    @InjectRepository(InvitationCode)
    private readonly invitationCodeRepository: Repository<InvitationCode>,
  ) {}

  async createInvitationCode(createInvitationCodeDto: CreateInvitationCodeDto): Promise<InvitationCode> {
    try {
      const generatedCode = this.generateRandomCode(10);

      const invitationCode = this.invitationCodeRepository.create({
        ...createInvitationCodeDto,
        code: generatedCode,
        isActive: true,
      });
      const savedInvitationCode = await this.invitationCodeRepository.save(invitationCode);
      logger.log(`Created InvitationCode with ID ${savedInvitationCode.id}`);
      return savedInvitationCode;
    } catch (error) {
      logger.error(`Error creating InvitationCode: ${error.message}`);
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

  async findAllInvitationCodes(): Promise<InvitationCode[]> {
    return this.invitationCodeRepository.find();
  }

  async findOneInvitationCode(id: number): Promise<InvitationCode> {
    try {
      const invitationCode = await this.invitationCodeRepository.findOne({ where: { id } });
      if (!invitationCode) {
        throw new NotFoundException(`InvitationCode with ID ${id} not found`);
      }
      return invitationCode;
    } catch (error) {
      logger.error(`Error finding InvitationCode with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateInvitationCode(id: number, updateInvitationCodeDto: UpdateInvitationCodeDto): Promise<InvitationCode> {
    const invitationCode = await this.invitationCodeRepository.findOne({ where: { id } });
    if (!invitationCode) {
      throw new NotFoundException(`InvitationCode with ID ${id} not found`);
    }

    if (updateInvitationCodeDto.code) {
      invitationCode.code = updateInvitationCodeDto.code;
    }

    return this.invitationCodeRepository.save(invitationCode);
  }

  async removeInvitationCode(id: number): Promise<void> {
    const result = await this.invitationCodeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`InvitationCode with ID ${id} not found`);
    }
  }
}
