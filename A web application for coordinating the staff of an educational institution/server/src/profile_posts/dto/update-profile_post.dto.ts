import { PartialType } from '@nestjs/mapped-types';
import { CreateProfilePostDto } from './create-profile_post.dto';

export class UpdateProfilePostDto extends PartialType(CreateProfilePostDto) {}
