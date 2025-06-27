import { Resolver, Args, Context, Query } from '@nestjs/graphql';
import { SignedFileUrl } from './file.dto';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}
  @Query(() => SignedFileUrl)
  signedFileUrl(
    @Args('filename') filename: string,
    @Context() context,
  ): SignedFileUrl {
    filename = this.fileService.getUniqueFilename(filename);
    const token = this.fileService.sign(filename);
    const { req } = context;
    const host = req.get('host');
    const isLocalhost =
      host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    return {
      uploadUrl: `${baseUrl}/file?token=${token}`,
      downloadUrl: `${baseUrl}/file/${filename}`,
    };
  }
}
