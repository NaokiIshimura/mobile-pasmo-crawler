# sample

---

## 参考
[protoファイルでProcedureを定義する｜作ってわかる！ はじめてのgRPC](https://zenn.dev/hsaki/books/golang-grpc-starting/viewer/proto)

## protocコマンドでコードを生成する

```
$ cd api
$ protoc --go_out=../pkg/grpc --go_opt=paths=source_relative \
	--go-grpc_out=../pkg/grpc --go-grpc_opt=paths=source_relative \
	moderator.proto
```

## server

```
$ go run cmd/server/main.go
```

```
$ grpcurl -plaintext -d '{"id": "testuser", "card":"card1"}' localhost:8080 myapp.HistoryService.Hello

{
  "histories": [
    {
      "ID": "testuser",
      "DataType": "card1#history#202404#0000",
      "Category": "チャージ",
      "Date": "04/14",
      "Value": 1000
    },
    ...
  ]
}
```

## client

標準入力

```
$ cd cmd/client
$ go run main.go

start gRPC Client.
1: send Request
2: exit
please enter >1
Please enter your name.
hogehoge
histories:{ID:"hogehoge" DataType:"test"} histories:{ID:"ccc" DataType:"ddd"}
```

## client2

net/http

```
$ go run cmd/client2/main.go
```

```
$ curl http://localhost:8081/accounts/testuser/cards/card1

[{"ID":"testuser","DataType":"card1#history#202404#0000","Category":"チャージ","Date":"04/14","Value":1000}, ...]
```

## client3

gin

```
$ go run cmd/client3/main.go
```

```
$ curl http://localhost:8081/accounts/testuser/cards/card1

[{"ID":"testuser","DataType":"card1#history#202404#0000","Category":"チャージ","Date":"04/14","Value":1000}, ...]
```

---

# docker

## .env

```
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

## server

```
# ビルド
$ docker image build -t go-sample2-server -f Dockerfile.server .
# コンテナ起動
$ docker container run -p 8080:8080 go-sample2-server
```

## client

```
# ビルド
$ docker image build -t go-sample2-client -f Dockerfile.client .
# コンテナ起動
$ docker container run -p 8081:8081 go-sample2-client
```

## docker compose

```
$ docker compose build
$ docker compose up
```
