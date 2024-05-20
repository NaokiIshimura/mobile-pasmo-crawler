# go lambda sample

Go の AWS Lambda 関数ハンドラー
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/golang-handler.html

## テスト
```
$ go test ./... -v
```

## ビルド
```
$ GOOS=linux go build -o bootstrap
```

## 圧縮
```
$ zip bootstrap.zip bootstrap
```

```

## 参考
- https://engineering.nifty.co.jp/blog/20337
- https://zenn.dev/simsim/articles/42cb71cec493f8
