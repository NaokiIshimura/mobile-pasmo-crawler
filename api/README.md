# go-gin-sample

---

## .envファイル

```
TABLE_NAME=xxxxx
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

---

## コマンド

### サーバ起動
```
$ TABLE_NAME=mpc-default-authenticator-table \
  go run .
```

### コンテナ起動
```
$ docker compose build
$ docker compose up
```

### リクエスト

#### アカウント情報
```
# GET
$ curl localhost:8080/accounts/test

# POST
$ curl -X POST localhost:8080/accounts/test -d '{"mailAddress": "aaa", "password": "bbb"}'
```

##### 認証画像情報
```
# GET
$ curl localhost:8080/accounts/test/authImage

# POST
$ curl -X POST localhost:8080/accounts/test/authImage -d '{"text": "aaa"}'
```
