import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signinDto';
import { Response } from 'express';
import { AdminInitiateAuthCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient, Credentials, GetCredentialsForIdentityCommand, GetIdCommand } from '@aws-sdk/client-cognito-identity';

@Injectable()
export class AuthService {
  async signin(signinDto: SigninDto, res: Response) {
    const cognitClinet = new CognitoIdentityProviderClient({
      region:process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
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

  async createTemporalCredential(idToken: string): Promise<Credentials> {
    const identityId = await this.getIdentityId(idToken);
    const cognitClinet = new CognitoIdentityClient({
      region:process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    })
    const command = new GetCredentialsForIdentityCommand({
      IdentityId: identityId,
      Logins: { [`cognito-idp.ap-northeast-1.amazonaws.com/${process.env.USER_POOL_ID}`]: idToken },
    })

    try {
      return (await cognitClinet.send(command)).Credentials
    } catch (e) {
      console.log('get tomporalCredetial error:', e)
      throw new UnauthorizedException()
    }
  }

  async getIdentityId(idToken: string): Promise<string> {
    const cognitClinet = new CognitoIdentityClient({
      region:process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    })

    const command = new GetIdCommand({
      IdentityPoolId: process.env.COGNITO_ID_POOL,
      Logins: { [`cognito-idp.ap-northeast-1.amazonaws.com/${process.env.USER_POOL_ID}`]: idToken },
    })

    try {
      return (await cognitClinet.send(command)).IdentityId
    } catch (e) {
      console.error(e)
      throw new UnauthorizedException()
    }
  }
}
