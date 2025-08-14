import { AppService } from './app.service';
import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // document.controller.ts

@UseGuards(ThrottlerGuard)
@Controller('documents')
export class DocumentController {
  private documents = new Map<number, any>();
  private idCounter = 1;

  @Throttle(5, 60)  // 1分あたり5回までのルート制限例
  @Post()
  create(@Body() body: any) {
    const id = this.idCounter++;
    this.documents.set(id, body);
    return { id, ...body };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const doc = this.documents.get(id);
    if (!doc) {
      return { error: 'Not found' };
    }
    return doc;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    if (!this.documents.has(id)) {
      return { error: 'Not found' };
    }
    this.documents.set(id, body);
    return { id, ...body };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    if (!this.documents.has(id)) {
      return { error: 'Not found' };
    }
    this.documents.delete(id);
    return { deleted: true };
  }
}
}
}
