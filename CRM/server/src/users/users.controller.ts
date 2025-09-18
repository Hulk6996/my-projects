import { Body, Controller, Post, HttpException, HttpStatus, UseGuards, Request, Patch, Get, Logger, Delete, Param, ParseIntPipe, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('register-user')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.registerUser(createUserDto);
      return { success: true, message: 'Регистрация прошла успешно', user };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('register-client')
  async registerClient(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.registerClient(createUserDto);
      return { success: true, message: 'Регистрация клиента прошла успешно', user };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Ошибка при регистрации клиента',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for user ${loginDto.email}`);
    try {
      const token = await this.usersService.validateUser(loginDto.email, loginDto.password);
      return { success: true, token };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Invalid credentials',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.updateUser(req.user.id, updateUserDto);
      return { success: true, updatedUser };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Authorization Header:', req.headers['authorization']); 
    return { success: true, data: await this.usersService.findOneById(req.user.id) };
  }

  @Get('/managers') 
  async findAllManagers(): Promise<User[]> {
    return this.usersService.findAllManagers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/non-admins')
  findAllNonAdminUsers(@Request() req) {
    return this.usersService.findAllNonAdminUsers(req.user.id);
  }

  @Get('/employees') 
  async findAllEmployees(): Promise<User[]> {
    return this.usersService.findAllEmployees();
  }

  @Get('/clients')
  async getClientsWithTasks(): Promise<any[]> {
    return this.usersService.findAllClientsWithTaskCount();
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string): Promise<User | undefined> {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      this.logger.error(`findUserById was called with invalid userId: ${id}`);
      throw new BadRequestException('Invalid userId provided');
    }
    return this.usersService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all-except-current')
  async findAllExceptCurrent(@Request() req) {
    return this.usersService.findAllNonAdminUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Только администратор может удалить пользователя');
    }
    await this.usersService.deleteUser(id);
    return { success: true, message: 'Пользователь успешно удален' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password/:id')
  async changePassword(@Param('id', ParseIntPipe) userId: number, @Body('newPassword') newPassword: string) {
    try {
      await this.usersService.changePassword(userId, newPassword);
      this.logger.log(`Password changed successfully for user with ID ${userId}`);
      return { success: true, message: 'Пароль успешно изменен' };
    } catch (error) {
      this.logger.error(`Error changing password for user with ID ${userId}: ${error.message}`);
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/role')
  async changeUserRole(@Param('id', ParseIntPipe) userId: number, @Body() body: { role: string }) {
    const { role } = body;
    if (!role) {
      throw new BadRequestException('Role must be provided');
    }

    try {
      const updatedUser = await this.usersService.changeUserRole(userId, role);
      return { success: true, updatedUser };
    } catch (error) {
      this.logger.error(`Error changing role for user with ID ${userId}: ${error.message}`);
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
