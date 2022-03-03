### 基于Next.js的Serverless能力实现的仿Wordpress功能的纯Restfull Api服务

## 1、云服务依赖：
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [腾讯云COS](https://cloud.tencent.com/product/cos)
- [腾讯验证码](https://007.qq.com/product.html)

全部env变量：
```typescript
MONGODB_URI='***'

COS_APP_ID='***'
COS_SECRET_KEY='***'
COS_SECRET_ID='***'
COS_BUCKET='***'
COS_REGION='***'

JWT_EXPIRES='***'
JWT_SECRET='***'

CAPTCHA_AID='***'
CAPTCHA_APP_SECRET_KEY='***'
```



