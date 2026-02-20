import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/role.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard) // JWT + Roles check
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * GET /stats
   * Access: ANALYST, ADMIN
   * Returns dashboard statistics
   */
  @Get()
  @Roles('ANALYST', 'ADMIN')
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}