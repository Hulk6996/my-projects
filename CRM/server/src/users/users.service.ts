import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ManagerCode } from '../manager_code/entities/manager_code.entity';
import { EmployeeCode } from '../employee_code/entities/employee_code.entity';
import { LogService } from '../log/log.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logService: LogService,
    @InjectRepository(ManagerCode)
    private readonly managerCodeRepository: Repository<ManagerCode>,
    @InjectRepository(EmployeeCode)
    private readonly employeeCodeRepository: Repository<EmployeeCode>,
    private readonly jwtService: JwtService
  ) {}

  async registerClient(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
  
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      surname: createUserDto.surname,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      role: 'client'
    });
  
    const savedUser = await this.userRepository.save(newUser);
    await this.logService.createLog(savedUser.id, 'Register', 'Client registered successfully.');

    return savedUser;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
  
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }
  
    let role = 'user';

    const managerCodeEntity = await this.managerCodeRepository.findOne({
      where: { code: createUserDto.code, isActive: true }
    });

    if (managerCodeEntity) {
      managerCodeEntity.isActive = false;
      await this.managerCodeRepository.save(managerCodeEntity);
      role = 'manager';
    } else {
      const employeeCodeEntity = await this.employeeCodeRepository.findOne({
        where: { code: createUserDto.code, isActive: true }
      });

      if (employeeCodeEntity) {
        employeeCodeEntity.isActive = false;
        await this.employeeCodeRepository.save(employeeCodeEntity);
        role = 'employee';
      } else {
        throw new NotFoundException('Неверный код регистрации');
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      surname: createUserDto.surname,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, await bcrypt.genSalt()),
      phone: createUserDto.phone,
      role
    });
  
    const savedUser = await this.userRepository.save(newUser);
    await this.logService.createLog(savedUser.id, 'Register', 'User registered successfully.');

    return savedUser;
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
    await this.logService.createLog(user.id, 'Login', 'User logged in successfully.');
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

    const updatedUser = await this.userRepository.save(user);

    await this.logService.createLog(userId, 'Update', 'User updated successfully.');

    return updatedUser;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    await this.userRepository.remove(user);
    await this.logService.createLog(userId, 'Delete', 'User deleted successfully.');
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await this.userRepository.save(user);
    this.logger.log(`Password changed successfully for user with ID ${userId}`);
    await this.logService.createLog(userId, 'Change Password', `Password changed for user ${userId}`);
  }

  
  async findAllEmployees(): Promise<User[]> {
    return this.userRepository.find({ where: { role: 'employee' } });
  }

  async findAllManagers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: 'manager' } });
  }
  
  async findUserById(userId: number): Promise<User> {
    if (!userId) {
      this.logger.error(`findUserById was called with invalid userId: ${userId}`);
      throw new Error('Invalid userId provided');
    }

    this.logger.log(`Fetching user with ID: ${userId}`);
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        this.logger.log(`User found: ${JSON.stringify(user)}`);
        return user;
      } else {
        this.logger.warn(`No user found with ID: ${userId}`);
        throw new Error('User not found');
      }
    } catch (error) {
      this.logger.error(`Database error occurred: ${error.message}`, error.stack);
      throw new Error('Database query failed');
    }
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

  async findAllClientsWithTaskCount(): Promise<any[]> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task') 
      .loadRelationCountAndMap('user.taskCount', 'user.tasks')
      .where('user.role = :role', { role: 'client' })
      .getMany();
  }

  async changeUserRole(userId: number, newRole: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    user.role = newRole;

    const updatedUser = await this.userRepository.save(user);
    await this.logService.createLog(userId, 'Update User Role', `User ${userId} role updated to ${newRole}`);

    return updatedUser;
  }
}
