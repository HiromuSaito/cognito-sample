import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signinDto';
import { Response } from 'express';
import { AdminInitiateAuthCommand, CognitoIdentityProvider, CognitoIdentityProviderClient, ListUserPoolClientsCommand, ListUserPoolsCommand } from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
    async signin(signinDto: SigninDto, res: Response) {
        const cognitClinet = new CognitoIdentityProviderClient({
            region: process.env.AWS_REGION
        })

        const command = new AdminInitiateAuthCommand({
            UserPoolId: process.env.USER_POOL_ID,
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                USERNAME: signinDto.email,
                PASSWORD: signinDto.password
            },
        })
        await cognitClinet.send(command).
            then((result) => {
                res.cookie('id_token', result.AuthenticationResult?.IdToken)
                res.cookie('access_token', result.AuthenticationResult?.AccessToken)
            })
            .catch(e => {
                console.log(e)
                throw new UnauthorizedException()
            })
    }
}
