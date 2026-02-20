import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadedFile } from './dto/create-import.dto';

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

@Injectable()
export class ImportsService {
  constructor(private prisma: PrismaService) {}

  async processExcel(file: UploadedFile) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

    const validRows: ClientData[] = [];
    const invalidRows: (ExcelRow | ClientData)[] = [];
    
    for (const row of rows) {
      if (row['Nom'] && row['Email']) {
        validRows.push({
          nom: row['Nom'] as string,
          prenom: row['Prenom'] || '',
          email: row['Email'] as string,
          telephone: row['Telephone'] || '',
          site: row['Site'] || '',
          type: row['Type'] || 'Client',
          createdAt: new Date(),
        });
      } else {
        invalidRows.push(row);
      }
    }

    // Vérifier doublons
    const finalValidRows: ClientData[] = [];
    for (const client of validRows) {
      const exists = await this.prisma.client.findUnique({ where: { email: client.email } });
      if (exists) {
        invalidRows.push(client);
      } else {
        await this.prisma.client.create({ data: client });
        finalValidRows.push(client);
      }
    }

    // Retourner un rapport
    return {
      totalRows: rows.length,
      validRows: finalValidRows.length,
      invalidRows: invalidRows.length,
    };
  }
}
