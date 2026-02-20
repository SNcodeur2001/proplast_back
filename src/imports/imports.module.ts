import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ImportsController],
  providers: [ImportsService, PrismaService]
})
export class ImportsModule {}
//on met ici tous les imports dont on a besoin pour le module imports