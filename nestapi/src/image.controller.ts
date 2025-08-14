// image.controller.ts
import {
  Controller, Post, Get, Delete, Param, Res, UploadedFile, UseInterceptors, UseGuards, Throttle,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@UseGuards(ThrottlerGuard)
@Controller('images')
export class ImageController {
  private uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }
  }

  @Throttle(10, 60)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
  }))
  uploadFile(@UploadedFile() file) {
    // 即時に成功レスポンスを返す
    return { filename: file.filename, url: `/images/${file.filename}` };
  }

  @Get(':filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.uploadPath, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    // ファイルをストリームで返す
    res.sendFile(filePath);
  }

  @Delete(':filename')
  deleteImage(@Param('filename') filename: string) {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { deleted: true };
    }
    return { error: 'File not found' };
  }
}
