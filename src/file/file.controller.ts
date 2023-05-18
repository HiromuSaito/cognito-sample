import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { IdToken } from '../decorators/id-token.decorator';
import { FileService } from './file.service';

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
}
