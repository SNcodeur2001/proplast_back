import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './exports.service';
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('clients')
  async exportClients(@Res() res: Response) {
    const { filename, path } = await this.exportService.generateExcel();
    return res.download(path, filename); // téléchargement direct
  }
}
