import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';

import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductFile(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) throw new BadRequestException('Make sure that the file is an image')

    return {
      fileName: file.originalname
    };
  }

}
