import { accessKey, bucketName, region, secretKey } from "../config";

import Aws from "aws-sdk";
import fs from "fs";

export default class MediaStoreService {
  private s3;

  constructor() {
    this.s3 = new Aws.S3({
      region,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
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
    try {
      const fileSplit = file.name.split(".");
      const fileType = fileSplit[fileSplit.length - 1];
      const fileName = `${new Date().getTime()}.${fileType}`;
      const params = {
        Bucket: `${bucketName}/${dir}`,
        Key: fileName,
        Body: file?.data,
        ContentType: file.mimetype,
      };

      const data = await this.s3.upload(params).promise();
      fs.rm(`${__dirname}/../../tmp`, { recursive: true }, () => {});
      return {
        key: data?.Location,
        Location: data?.Key,
        allData: data,
      };
    } catch (error) {
      new Error();
      return false;
    }
  }

  async get(key: string) {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    const data = await this.s3.getObject(params).promise();
    return data;
  }

  async delete({ key }: { key: string }): Promise<any> {
    try {
      const params = {
        Bucket: `${bucketName}`,
        Key: key,
      };
      const data = await this.s3.deleteObject(params).promise();
      return data;
    } catch (error) {
      new Error();
      return false;
    }
  }
  async deleteAll(ids: string[]): Promise<any> {
    try {
      const params = {
        Bucket: bucketName,
        Delete: {
          Objects: ids.map((id) => ({ Key: id })),
        },
      };
      const data = await this.s3.deleteObjects(params).promise();
      return data;
    } catch (error) {
      new Error();
      return false;
    }
  }

  async getList(path: string): Promise<any> {
    try {
      // wildcard string in aws object find

      const params = {
        Bucket: bucketName,
        Delimiter: "/",
        Prefix: path,
      };
      const data = await this.s3.listObjects(params).promise();
      return data;
    } catch (error) {
      new Error();
      return false;
    }
  }
}
