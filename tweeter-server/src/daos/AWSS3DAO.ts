import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3DAO } from "./S3DAO";

//make sure bucket is public read
export class AWSS3DAO implements S3DAO {
  private bucketName = "cs340-tweeter-images-tgjones";
  private region = "us-west-2";
  private readonly client = new S3Client({
    region: this.region,
  });

  async putImage(
    key: string,
    base64Data: string,
    contentType: string
  ): Promise<string> {
    const buffer = Uint8Array.from(Buffer.from(base64Data, "base64"));

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    await this.client.send(new PutObjectCommand(params));

    return `https://${
      this.bucketName
    }.s3.us-west-2.amazonaws.com/${encodeURIComponent(key)}`;
  }
}
