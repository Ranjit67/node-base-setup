// import {
//   Storage,
//   BucketName as Bucket,
//   Region,
//   AccessKey,
//   SecretKey,
// } from "../config";
const cloudinary = require("cloudinary").v2;
import fs from "fs";
// import { BucketName, region, accessKeyId, secretAccessKey } from "../config";
// const BucketName = Bucket;
// const region = Region;
// const accessKeyId = AccessKey;
// const secretAccessKey = SecretKey;
class MediaStoreService {
  //   private s3;
  // private cloudinaryConfig;

  constructor() {
    // this.s3 = new Aws.S3({
    //   region,
    //   accessKeyId,
    //   secretAccessKey,
    // });

    cloudinary.config({
      cloud_name: "dk9f2lkr4",
      api_key: "279599461771391",
      api_secret: "eNhJDYbyvKipimC8g9GHCHCzTAQ",
    });
  }

  public async upload({
    file,
    dir,
    folderName,
  }: {
    file: any;
    dir: string;
    folderName?: string;
  }): Promise<
    | {
        key: string;
        Location: string;
        allData: any;
      }
    | boolean
  > {
    try {
      //   if (Storage === "AWS") {
      //     const fileSplit = file.name.split(".");
      //     const fileType = fileSplit[fileSplit.length - 1];
      //     const fileName = `${new Date().getTime()}.${fileType}`;
      //     const params = {
      //       Bucket: `${BucketName}/${dir}`,
      //       Key: fileName,
      //       Body: file?.data,
      //       ContentType: file.mimetype,
      //     };

      //     const data = await this.s3.upload(params).promise();
      //     fs.rm(`${__dirname}/../../tmp`, { recursive: true }, () => {});
      //     return {
      //       key: data?.Location,
      //       Location: data?.Key,
      //       allData: data,
      //     };
      //   } else {
      const tempFile = file.tempFilePath;
      const option: any = {
        resource_type: file.mimetype.split("/")[0],
      };
      folderName && (option.folder = folderName);
      if (file.mimetype.split("/")[0] === "application")
        delete option["resource_type"];
      console.log({ tempFile });
      const uploadImageData = await cloudinary.uploader.upload(
        tempFile,
        option
      );
      fs.rm(`${tempFile}`, { recursive: true }, () => {});
      // fs.unlinkSync(file.tempFilePath);

      return {
        key: uploadImageData.secure_url,
        Location: uploadImageData.public_id,
        allData: uploadImageData,
      };
      //   }
    } catch (error) {
      new Error();
      return false;
    }
  }

  //   async get(key: string) {
  //     const params = {
  //       Bucket: BucketName,
  //       Key: key,
  //     };
  //     const data = await this.s3.getObject(params).promise();
  //     return data;
  //   }

  async delete(key: string): Promise<any> {
    try {
      //   if (Storage === "AWS") {
      //     const params = {
      //       Bucket: `${BucketName}`,
      //       Key: key,
      //     };
      //     const data = await this.s3.deleteObject(params).promise();
      //     return data;
      //   } else {
      if (!key) return false;
      const deleteImageData = await cloudinary.uploader.destroy(key);
      return deleteImageData;
      //   }
    } catch (error) {
      new Error();
      return false;
    }
  }
  async deleteAll(ids: string[]): Promise<any> {
    try {
      //   if (Storage === "AWS") {
      //     const params = {
      //       Bucket: BucketName,
      //       Delete: {
      //         Objects: ids.map((id) => ({ Key: id })),
      //       },
      //     };
      //     const data = await this.s3.deleteObjects(params).promise();
      //     return data;
      //   } else {
      const deleteAll = await cloudinary.api.delete_resources(ids);
      return deleteAll;
      //   }
    } catch (error) {
      new Error();
      return false;
    }
  }
}

export default MediaStoreService;
