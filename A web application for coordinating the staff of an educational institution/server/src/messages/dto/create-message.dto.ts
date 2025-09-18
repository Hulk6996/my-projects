import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  readonly text: string;

  @IsInt()
  readonly authorId: number;
}
