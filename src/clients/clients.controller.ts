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

import { RolesGuard } from 'auth/guards/role.guard';
import { Roles } from 'common/role.decorator';

@Controller('clients')
@UseGuards(RolesGuard) // applique le guard à tout le controller
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  @Roles('ANALYST', 'ADMIN')
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @Roles('ANALYST', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
