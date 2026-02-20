import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ImportsModule } from './imports/imports.module';
import { StatsModule } from './stats/stats.module';
import { ExportsModule } from './exports/exports.module';

@Module({
  imports: [AuthModule, ClientsModule, ImportsModule, StatsModule, ExportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
