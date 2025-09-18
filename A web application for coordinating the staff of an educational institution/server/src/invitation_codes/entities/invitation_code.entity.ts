import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({ name: 'invitation_codes' })
export class InvitationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;


}