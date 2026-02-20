import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ExcelRow {
  Nom?: string;
  Prenom?: string;
  Email?: string;
  Telephone?: string;
  Site?: string;
  Type?: string;
}

interface ClientData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  site: string;
  type: string;
  createdAt: Date;
}

export interface ImportReport {
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

@Injectable()
export class ImportsService {
  constructor(private prisma: PrismaService) {}

  private async processSingleExcel(
    file,
  ): Promise<ImportReport> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

    const validClients: ClientData[] = [];
    let invalidCount = 0;

    // 1️⃣ Validation des données
    for (const row of rows) {
      if (row.Nom && row.Email) {
        validClients.push({
          nom: row.Nom,
          prenom: row.Prenom || '',
          email: row.Email,
          telephone: row.Telephone || '',
          site: row.Site || '',
          type: row.Type || 'Client',
          createdAt: new Date(),
        });
      } else {
        invalidCount++;
      }
    }

    // 2️⃣ Insertion en base (skip doublons email)
    const result = await this.prisma.client.createMany({
      data: validClients,
      skipDuplicates: true,
    });

    const insertedCount = result.count;
    const duplicateCount = validClients.length - insertedCount;

    const finalInvalidCount = invalidCount + duplicateCount;

    // 3️⃣ Enregistrement de l'import
    await this.prisma.import.create({
      data: {
        filename: file.originalname,
        totalRows: rows.length,
        validRows: insertedCount,
        invalidRows: finalInvalidCount,
      },
    });

    return {
      filename: file.originalname,
      totalRows: rows.length,
      validRows: insertedCount,
      invalidRows: finalInvalidCount,
    };
  }

  async processExcels(files) {
    const reports: ImportReport[] = [];

    for (const file of files) {
      const report = await this.processSingleExcel(file);
      reports.push(report);
    }

    return {
      totalFiles: files.length,
      reports,
    };
  }
}