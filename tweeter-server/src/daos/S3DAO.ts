export interface S3DAO {
  putImage(
    key: string,
    base64Data: string,
    contentType: string
  ): Promise<string>;
}
