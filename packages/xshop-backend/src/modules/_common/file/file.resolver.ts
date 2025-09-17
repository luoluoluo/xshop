import { Resolver, Args, Query } from '@nestjs/graphql';
import { SignedFileUrl } from './file.dto';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}
  @Query(() => SignedFileUrl)
  signedFileUrl(@Args('filename') filename: string): SignedFileUrl {
    filename = this.fileService.getUniqueName(filename);
    const token = this.fileService.sign(filename);
    const fileUploadUrl = this.configService.get<string>('FILE_URL');
    return {
      uploadUrl: `${fileUploadUrl}?token=${token}`,
      downloadUrl: `${fileUploadUrl}/${filename}`,
    };
  }
}
