import COS from 'cos-nodejs-sdk-v5';

class Cos {
  /**
   * 实例初始化
   */
  static _cos = () => {
    return new COS({
      SecretId: process.env.COS_SECRET_ID,
      SecretKey: process.env.COS_SECRET_KEY,
    });
  };

  /**
   * 上传文件
   * @param params
   */
  static putObject = (params: COS.PutObjectParams): Promise<COS.PutObjectResult> => {
    return new Promise(async (resolve, reject) => {
      let cos = Cos._cos();
      const result = await cos.putObject(params);
      if (result) {
        resolve(result);
      } else {
        reject({
          code: 500,
        });
      }
      // @ts-ignore
      cos = null;
    });
  };

  /**
   * 删除文件
   * @param params
   */
  static deleteMultipleObject = (params: COS.DeleteMultipleObjectParams) => {
    return new Promise(async (resolve, reject) => {
      let cos = Cos._cos();
      const result = await cos.deleteMultipleObject(params);
      if (result) {
        resolve(result);
      } else {
        reject({
          code: 500,
        });
      }
      // @ts-ignore
      cos = null;
    });
  };
}

export default Cos;
