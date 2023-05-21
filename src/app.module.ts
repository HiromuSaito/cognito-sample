import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController, FileController],
  providers: [AuthService, FileService],
})
export class AppModule { }
