import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class UploadService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}

  // multer gives us the file as an in-memory buffer (no disk writes to
  // clean up); we pipe that buffer into Cloudinary's upload stream.
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: 'task-manager/attachments', resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload returned no result'));
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
