import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ImportsModule } from './imports/imports.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [AuthModule, ClientsModule, ImportsModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
