import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  constructor(private authService: AuthService) { }

  async getFilelist(idtoken: string) {
    const credentials = await this.authService.createTemporalCredential(idtoken)
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken
      }
    })
    const command = new ListObjectsCommand(
      {
        Bucket: process.env.BUCKET_NAME
      }
    )
    try {
      const res = await s3Client.send(command)
      return res.Contents.map(c => ({ name: c.Key }))
    } catch (e) {
      console.error('list object error : ', e)
    }
  }
}

