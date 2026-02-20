import { IsNotEmpty } from 'class-validator';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class CreateImportDto {
  @IsNotEmpty()
  file!: UploadedFile;
}
