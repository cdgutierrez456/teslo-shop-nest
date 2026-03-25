import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import type { Response } from 'express';

import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';

import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files')
@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Get a product image by filename' })
  @ApiParam({ name: 'imageName', description: 'Image filename (e.g. 1740176-00-A_0_2000.jpg)' })
  @ApiResponse({ status: 200, description: 'Returns the image file' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName)
    res.sendFile(path)
  }

  @Post('product')
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file (jpg, png, gif, webp)' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Image uploaded, returns the secure URL' })
  @ApiResponse({ status: 400, description: 'File is not a valid image' })
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

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return {
      fileName: secureUrl
    };
  }

}
