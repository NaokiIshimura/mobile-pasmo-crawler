FROM golang:1.22.2

WORKDIR /app

# モジュールをインストール
COPY go.mod go.sum ./
RUN go mod download

COPY . /app

# ビルド
RUN go build -o /bootstrap

EXPOSE 8080

# ビルドしない場合、
# CMD ["go", "run", "."]

# ビルドした場合、
CMD ["/bootstrap"]
