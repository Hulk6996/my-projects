import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StackCode } from './../stack_code/entities/stack_code.entity';
import { InvitationCode } from './../invitation_codes/entities/invitation_code.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly defaultProfileImage = 'https://ростр.рф/assets/img/no-profile.png'; 

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StackCode)
    private readonly stackCodeRepository: Repository<StackCode>,
    @InjectRepository(InvitationCode)
    private readonly invitationCodeRepository: Repository<InvitationCode>,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    } 

    let role = 'user'; 

    const stackCodeEntity = await this.stackCodeRepository.findOne({
      where: { code: createUserDto.stackCode, isActive: true },
    });

    if (stackCodeEntity) {
      stackCodeEntity.isActive = false;
      await this.stackCodeRepository.save(stackCodeEntity);
      role = 'manager'; 
    } else {
      const invitationCodeEntity = await this.invitationCodeRepository.findOne({
        where: { code: createUserDto.stackCode, isActive: true },
      });

      if (invitationCodeEntity) {
        invitationCodeEntity.isActive = false;
        await this.invitationCodeRepository.save(invitationCodeEntity);
        role = 'employee'; 
      } else {
        throw new NotFoundException('Неверный код регистрации');
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      name: createUserDto.firstName,
      surname: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
      dateOfBirth: createUserDto.dateOfBirth,
      gender: createUserDto.gender,
      role,
      profilePicture: this.defaultProfileImage 
    });

    return this.userRepository.save(newUser);
  }


  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.log(`Validating user ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    user.name = updateUserDto.name ?? user.name;
    user.surname = updateUserDto.surname ?? user.surname;
    user.email = updateUserDto.email ?? user.email;

    if (updateUserDto.profilePicture) {
      user.profilePicture = updateUserDto.profilePicture;
    }

    user.updatedAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async findAllNonAdminUsers(currentUserId: number): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.role != :adminRole', { adminRole: 'admin' })
      .andWhere('user.id != :currentUserId', { currentUserId })
      .getMany();
  }
  
  async findAllNonAdminUser(currentUserId: number): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.id != :currentUserId', { currentUserId })
      .getMany();
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    await this.userRepository.remove(user);
  }
  
  async changePassword(userId: number, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
      }
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      user.updatedAt = new Date();
  
      await this.userRepository.save(user);
  
      this.logger.log(`Password changed successfully for user with ID ${userId}`);
    } catch (error) {
      this.logger.error(`Error changing password for user with ID ${userId}: ${error.message}`);
      throw error;
    }
  }

  async findAllEmployees(): Promise<User[]> {
    return this.userRepository.find({ where: { role: 'employee' } });
  }
  
  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  } 
}



