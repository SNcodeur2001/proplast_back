import {
  Controller,
  Post,
  Get,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/role.decorator';
import type { Response } from 'express';

@Controller('imports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  /**
   * GET /imports/template
   * Access: ADMIN, ANALYST
   * Télécharge le template d'import Excel
   */
  @Get('template')
  @Roles('ADMIN', 'ANALYST')
  async downloadTemplate(@Res() res: Response) {
    const { filename, path } = await this.importsService.generateTemplate();
    return res.download(path, filename);
  }

  /**
   * POST /imports/files
   * Access: ADMIN only
   * Upload Excel files to import clients
   */
  @Post('files')
  @UseInterceptors(FilesInterceptor('file'))
  @Roles('ADMIN')
  async uploadExcels(@UploadedFiles() files: Express.Multer.File[]) {
    return this.importsService.processExcels(files);
  }
}