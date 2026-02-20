import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async generateExcel(): Promise<{ filename: string; path: string }> {
    // 1. Récupérer tous les clients
    const clients = await this.prisma.client.findMany();

    // 2. Transformer en rows Excel
    const rows = clients.map((client) => ({
      Nom: client.nom,
      Prenom: client.prenom,
      Email: client.email,
      Telephone: client.telephone,
      Site: client.site,
      Type: client.type,
      CreatedAt: client.createdAt,
    }));

    // 3. Créer la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    // 4. Versionning du fichier
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const time = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
    const filename = `clients_export_${date}_${time}.xlsx`;

    const exportDir = path.join(__dirname, '../../exported');

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const exportPath = path.join(exportDir, filename);

    // 5. Sauvegarder le fichier
    XLSX.writeFile(workbook, exportPath);

    return { filename, path: exportPath };
  }
}
