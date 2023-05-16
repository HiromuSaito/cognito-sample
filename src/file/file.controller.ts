import { Controller, Get } from '@nestjs/common';
import { IdToken } from '../decorators/id-token.decorator';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(private fileService: FileService) { }

    @Get('/list')
    async fileList(@IdToken() idToken:string){
        return this.fileService.getFilelist(idToken)
    }
}
