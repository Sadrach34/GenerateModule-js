import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SalesService } from '../../application/use-case/sales.service';
import { CreateSaleDto } from '../../application/dtos/create-sales.dto';
import { UpdateSaleDto } from '../../application/dtos/update-sales.dto';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SalesService) {}

  @Get()
  getAll() {
    return this.saleService.getAllSales();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.getSaleById(id);
  }

  @Post()
  create(@Body() data: CreateSaleDto) {
    return this.saleService.createSales(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSaleDto) {
    return this.saleService.updateSale(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.deleteSale(id);
  }
}
