import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

interface ExcelRow {
  'Nom/Structure'?: string;
  'Personne Contact'?: string;
  'Numéro'?: string;
  'Adresse'?: string;
  'Contacté via'?: string;
  'Email'?: string;
  'Téléphone'?: string;
  'Site'?: string;
  'Type'?: string;
}

interface ClientData {
  nom: string;
  personneContact?: string | null;
  numero?: string | null;
  adresse?: string | null;
  contacteVia: string;
  email?: string | null;
  telephone?: string | null;
  site?: string | null;
  type?: string | null;
  createdAt: Date;
}

export interface ImportReport {
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class ImportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère le template Excel à télécharger
   */
  async generateTemplate(): Promise<{ filename: string; path: string }> {
    const headers = [
      'Nom/Structure',
      'Personne Contact',
      'Numéro',
      'Adresse',
      'Contacté via',
      'Email',
      'Téléphone',
      'Site',
      'Type',
    ];

    const worksheet = XLSX.utils.json_to_sheet([], {
      header: headers,
    });

    const exampleData = [
      {
        'Nom/Structure': 'Exemple Entreprise',
        'Personne Contact': 'Jean Dupont',
        'Numéro': '001',
        'Adresse': '123 Rue de Paris',
        'Contacté via': 'SOGEVADE',
        'Email': 'contact@exemple.com',
        'Téléphone': '+33612345678',
        'Site': 'Paris',
        'Type': 'Client',
      },
    ];

    const exampleSheet = XLSX.utils.json_to_sheet(exampleData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.utils.book_append_sheet(workbook, exampleSheet, 'Exemple');

    const templateDir = path.join(process.cwd(), 'templates');
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }

    const filename = 'template_import_clients.xlsx';
    const templatePath = path.join(templateDir, filename);

    XLSX.writeFile(workbook, templatePath);

    return { filename, path: templatePath };
  }

  /**
   * Traite un fichier Excel d'import
   */
  private async processSingleExcel(file: MulterFile): Promise<ImportReport> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

    const validClients: ClientData[] = [];
    let invalidCount = 0;

    for (const row of rows) {
      if (!row['Nom/Structure'] || !row['Contacté via']) {
        invalidCount++;
        continue;
      }

      const contacteVia = row['Contacté via']?.trim().toUpperCase();
      if (!['SOGEVADE', 'RECUPLAST'].includes(contacteVia)) {
        invalidCount++;
        continue;
      }

      validClients.push({
        nom: row['Nom/Structure'],
        personneContact: row['Personne Contact'] || null,
        numero: row['Numéro'] || null,
        adresse: row['Adresse'] || null,
        contacteVia: contacteVia,
        email: row['Email'] || null,
        telephone: row['Téléphone'] || null,
        site: row['Site'] || null,
        type: row['Type'] || null,
        createdAt: new Date(),
      });
    }

    const transactionResult = await this.prisma.$transaction(async (tx) => {
      const result = await tx.client.createMany({
        data: validClients,
        skipDuplicates: true,
      });

      const insertedCount = result.count;
      const duplicateCount = validClients.length - insertedCount;
      const finalInvalidCount = invalidCount + duplicateCount;

      const importRecord = await tx.import.create({
        data: {
          filename: file.originalname,
          totalRows: rows.length,
          validRows: insertedCount,
          invalidRows: finalInvalidCount,
        },
      });

      return {
        insertedCount,
        finalInvalidCount,
        importRecord,
      };
    });

    return {
      filename: file.originalname,
      totalRows: rows.length,
      validRows: transactionResult.insertedCount,
      invalidRows: transactionResult.finalInvalidCount,
    };
  }

  async processExcels(files: MulterFile[]) {
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