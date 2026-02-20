import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {FilesInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';

@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}


  @Post('files')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadExcels(@UploadedFiles() files: Express.Multer.File[]) {
    return this.importsService.processExcels(files);
  }
}
