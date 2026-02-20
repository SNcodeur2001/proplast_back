import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/role.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard) // JWT + Roles check
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  /**
   * POST /clients
   * Access: ADMIN only
   */
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  /**
   * GET /clients
   * Access: ANALYST, ADMIN
   */
  @Get()
  @Roles('ANALYST', 'ADMIN')
  findAll() {
    return this.clientsService.findAll();
  }

  /**
   * GET /clients/:id
   * Access: ANALYST, ADMIN
   */
  @Get(':id')
  @Roles('ANALYST', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  /**
   * PUT /clients/:id
   * Access: ADMIN only
   */
  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  /**
   * DELETE /clients/:id
   * Access: ADMIN only
   */
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
