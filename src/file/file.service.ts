import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class FileService {
  constructor(private authService: AuthService) { }

  private async getS3Client(idToken: string): Promise<S3Client> {
    const credentials = await this.authService.createTemporalCredential(idToken)
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretKey,
        sessionToken: credentials.SessionToken
      }
    })
  }

  async getFilelist(idtoken: string) {
    const s3Client = await this.getS3Client(idtoken)
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
      throw new InternalServerErrorException()
    }
  }

  async getFile(idToken: string, fileName: string) {
    const s3Client = await this.getS3Client(idToken)

    const command = new GetObjectCommand(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName
      }
    )
    try {
      const res = await s3Client.send(command)
      return res.Body.transformToByteArray()
    } catch (e) {
      console.error('get object error:', e)
      throw new InternalServerErrorException()
    }
  }

  async uploadFile(file: Express.Multer.File, idToken: string) {
    const s3Client = await this.getS3Client(idToken)

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer
    })
    await s3Client.send(command).catch(e => {
      console.error('put object error:', e)
      if (e.Code === 'AccessDenied') {
        throw new UnauthorizedException()
      }
      throw new InternalServerErrorException()
    })
  }
}

