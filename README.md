# mobile pasmo crawler

## ディレクトリ構成

ディレクトリ | 説明
---        | ---
terraform  | インフラ
nextjs     | クライアント
grpc       | gRPC クライアント/サーバ

---

## terraform

### 準備

```
$ cd terraform
$ terraform init

$ cd function/crawler
$ npm install --production

$ cd ../parser
$ npm install --production

$ cd ../moderator
$ npm install --production

$ cd ../..
```

### コマンド

```
# 差分確認
$ terraform plan

# 適用
$ terraform apply

# 削除
$ terraform destory
```

---

## nextjs

### 準備

#### envファイル

```
# nextjs/.env
NEXT_PUBLIC_REGION=ap-northeast-1
NEXT_PUBLIC_ACCESS_KEY=xxxxx
NEXT_PUBLIC_SECRET_ACCESS_KEY=xxxxx
NEXT_PUBLIC_AUTHENTICATOR_TABLE_NAME=mpc-default-authenticator-table
NEXT_PUBLIC_CRAWLER_TABLE_NAME=mpc-default-crawler-table
NEXT_PUBLIC_CRAWLER_FUNCTION_NAME=mpc-default-crawler-function
NEXT_PUBLIC_MODERATOR_TABLE_NAME=mpc-default-moderator-table
NEXT_PUBLIC_GRPC_SERVER_HOST_NAME=http://localhost:8080
NEXT_PUBLIC_API_SERVER_HOST_NAME=http://localhost:8082
NEXT_PUBLIC_API_SERVER_AUTH_TOKEN=mpc-client-request-token
```

### コマンド
```
# cd nextjs

# 準備
$ npm install

# 起動
$ npm run dev
```

---

## grpc

### 準備

#### envファイル
```
# grpc/.env.client
GRPC_SERVER=xxxxx
```

```
# grpc/.env.server
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
TABLE_NAME=xxxxx
```

### コマンド
```
# コンテナビルド
$ docker compose build
# コンテナ起動
$ docker compose up
```

---

## api

### 準備

#### envファイル
```
# api/.env
TABLE_NAME=xxxxx
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

### コマンド
```
# コンテナビルド
$ docker compose build
# コンテナ起動
$ docker compose up
```
