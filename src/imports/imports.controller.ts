import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/role.decorator';

@Controller('imports')
@UseGuards(JwtAuthGuard, RolesGuard) // JWT + Roles check
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

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
