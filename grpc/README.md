# gRPC

## grpc

```
$ cd api
$ protoc --go_out=../pkg/grpc --go_opt=paths=source_relative \
	--go-grpc_out=../pkg/grpc --go-grpc_opt=paths=source_relative \
	moderator.proto
```

---

## docker

### .env
```
# .env.client
GRPC_SERVER=xxxxx
```

```
# .env.server
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

### client

```
# コンテナビルド
$ docker image build -t grpc-client -f Dockerfile.client .
# コンテナ起動
$ docker container run -p 8080:8080 grpc-client
```

### server

```
# コンテナビルド
$ docker image build -t grpc-server -f Dockerfile.server .
# コンテナ起動
$ docker container run -p 8081:8081 grpc-server
```

### docker compose

```
# コンテナビルド
$ docker compose build
# コンテナ起動
$ docker compose up
```
