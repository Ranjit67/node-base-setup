import {
  accessKey,
  bucketName,
  cloudFont,
  cloudFontDistribution,
  region,
  secretKey,
} from "../config";

import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
export default class MediaStoreService {
  private s3;
  private cloudFont;

  constructor() {
    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
    this.cloudFont = new CloudFrontClient({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }
  private async invalidateFileCache(filename: string) {
    try {
      const path = [`/${filename}`];
      const cmd = new CreateInvalidationCommand({
        DistributionId: cloudFontDistribution,
        InvalidationBatch: {
          CallerReference: new Date().getTime().toString(),
          Paths: { Quantity: path.length, Items: path },
        },
      });
      await this.cloudFont.send(cmd);
    } catch (error) {
      return false;
    }
  }

  async delete({ key }: { key: string }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: `${bucketName}`,
          Key: key,
        };

        const deleteData = new DeleteObjectCommand({
          ...params,
        });
        // DELETE FROM S3 BUCKET
        await this.s3.send(deleteData);
        // INVALIDATE THE CLOUD FRONT CACHE
        await this.invalidateFileCache(key);
        return resolve(true);
      } catch (error) {
        new Error();
        return resolve(false);
      }
    });
  }
  // update Image
  async updateImage({ path, file }: { file: any; path: string }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: `${bucketName}`,
          Key: path,
          Body: file?.data,
          ContentType: file.mimetype,
        };

        const objectSetUp = new PutObjectCommand({
          ...params,
        });
        const data = await this.s3.send(objectSetUp);

        await this.invalidateFileCache(path);

        return resolve(data);
      } catch (error) {
        new Error();
        return resolve(false);
      }
    });
  }

  public async upload({ file, dir }: { file: any; dir: string }): Promise<
    | {
        key: string;
        Location: string;
        allData: any;
      }
    | boolean
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const fileSplit = file.name.split(".");
        const fileType = fileSplit[fileSplit.length - 1];
        const fileName = `${new Date().getTime()}.${fileType}`;

        // const partSize = 1 * 1024 * 1024; // 5 MB
        const fileStream = fs.createReadStream(file.tempFilePath);

        const multipartParams = {
          Bucket: bucketName,
          Key: `${dir}/${fileName}`,
          ContentType: file.mimetype,
        };

        const { UploadId } = await this.s3.send(
          new CreateMultipartUploadCommand(multipartParams)
        );

        const parts: any[] = [];

        for await (const chunk of fileStream) {
          const partNumber = parts.length + 1;
          const partParams = {
            Body: chunk,
            Bucket: bucketName,
            Key: `${dir}/${fileName}`,
            PartNumber: partNumber,
            UploadId: UploadId,
          };

          const { ETag } = await this.s3.send(
            new UploadPartCommand(partParams)
          );
          parts.push({ ETag, PartNumber: partNumber });
        }

        const params = {
          Bucket: bucketName,
          Key: `${dir}/${fileName}`,
          UploadId: UploadId,
          MultipartUpload: { Parts: parts },
        };

        await this.s3.send(new CompleteMultipartUploadCommand(params));

        return resolve({
          key: `${cloudFont}/${params?.Key}`,
          Location: `${params?.Key}`,
          allData: "",
        });
      } catch (error) {
        console.log(error);
        return resolve(false);
      }
    });
  }

  async newUpload({ file, dir }: { file: any; dir: string }) {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
