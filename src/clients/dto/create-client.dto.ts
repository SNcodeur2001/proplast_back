import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  nom!: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  telephone!: string;

  @IsString()
  site!: string;

  @IsString()
  type!: string; // Client, Trieur, Partenaire
}
