import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalClients = await this.prisma.client.count();

    const totalImports = await this.prisma.import.count();

    const clientsByType = await this.prisma.client.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
    });

    const recentImports = await this.prisma.import.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      totalClients,
      totalImports,
      clientsByType: clientsByType.map((item) => ({
        type: item.type,
        count: item._count.type,
      })),
      recentImports,
    };
  }
}