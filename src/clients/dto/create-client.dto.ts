import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreateClientDto {
  @IsString()
  nom!: string; // Obligatoire

  @IsOptional()
  @IsString()
  personneContact?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsIn(['SOGEVADE', 'RECUPLAST'])
  contacteVia!: string; // Obligatoire

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsString()
  type?: string;
}