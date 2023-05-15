import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { SigninDto } from './dto/signinDto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    @HttpCode(200)
    signin(@Body() body: SigninDto,
        @Res({ passthrough: true }) res: Response,) {
        return this.authService.signin(body, res)
    }
}
