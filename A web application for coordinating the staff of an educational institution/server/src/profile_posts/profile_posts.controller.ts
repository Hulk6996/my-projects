import { Controller, Post, UseInterceptors, UploadedFile, Req, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePostService } from './profile_posts.service';
import { multerConfig } from './multer.config';

@Controller('profile-posts')
export class ProfilePostController {
  constructor(private profilePostService: ProfilePostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {

    const { text, userId } = body;

    if (!userId || (!text && !file)) {
      throw new HttpException('Missing userId, or both text and file', HttpStatus.BAD_REQUEST);
    }

    if(file){
      const imagePath = file.path;
    }

    return this.profilePostService.create(text || '', userId, file ? file.path : null);
  }
}

