import { Controller, Get, Header, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { IdToken } from '../decorators/id-token.decorator';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
    constructor(private fileService: FileService) { }

    @Get('/list')
    async fileList(@IdToken() idToken: string) {
        return this.fileService.getFilelist(idToken)
    }

    @Get(':name')
    @Header('content-type', 'application/pdf')
    async getFile(@IdToken() idToken: string, @Param() params: any) {
        const file = await this.fileService.getFile(idToken, params.name)
        return new StreamableFile(file)
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@IdToken() idToken: string, @UploadedFile() file: Express.Multer.File) {
        await this.fileService.uploadFile(file, idToken)
    }
}
