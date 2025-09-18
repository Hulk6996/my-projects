import { Body, Controller, Post, HttpException, HttpStatus, UseGuards, Request, Patch, Get, Logger, Delete, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
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

  @Post('registration')
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
    console.log('Authorization Header:', req.headers['authorization']); // Логирование заголовка Authorization
    return { success: true, data: await this.usersService.findOneById(req.user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/non-admins')
  findAllNonAdminUsers(@Request() req) {
    return this.usersService.findAllNonAdminUsers(req.user.id);
  }

  @Get('/employees') // Обновите путь
  async findAllEmployees(): Promise<User[]> {
    return this.usersService.findAllEmployees();
  }

  @Get('/:id') // Обновите путь
  async findUserById(@Param('id') id: string): Promise<User | undefined> {
    return this.usersService.findUserById(Number(id)); // Преобразуйте id в число
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
}
