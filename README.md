# cognito-sample

Amazon Cognito を使用した認証・認可のサンプルコード  
## ユースケース
![ユースケース図](./usecase.svg)
## アーキテクチャ
![アーキテクチャ](./architecture.svg)



## setup
AWSリソースを作成の上、プロジェクトルートディレクトリに下記を記載した.envファイルを作成
``` :.env
AWS_SECRET_ACCESS_KEY=hoge
AWS_DEFAULT_REGIONhoge
AWS_ACCESS_KEY_IDhoge
USER_POOL_IDhoge
COGNITO_CLIENT_IDhoge
COGNITO_ID_POOLhoge
BUCKET_NAMEhoge
```

``` bash
npm install
npm run start
```


### 参考
[AWS CLIで動かして学ぶCognito IDプールを利用したAWSの一時クレデンシャルキー発行](https://dev.classmethod.jp/articles/get-aws-temporary-security-credentials-with-cognito-id-pool-by-aws-cli/#toc-13)