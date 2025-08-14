import { AppService } from './app.service';
import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get("/")
  async findfirst():Promise<String>{
    return this.appService.getHello()
  }
  // document.controller.ts
}
