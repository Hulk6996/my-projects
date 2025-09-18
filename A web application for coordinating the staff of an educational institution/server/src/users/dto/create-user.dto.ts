import { Gender } from './../entities/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: Gender;
  stackCode: string;
  profilePicture: string;
}