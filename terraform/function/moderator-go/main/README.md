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

## SQS Event

### SQSメッセージ
```
{"id":"testuser","dataType":"card1#history#parsed","timestamp":"1714363438","result":{"head":{"title":"モバイルPASMO＞SF（電子マネー）残額履歴"},"body":{"select":{"selected":"2024/05"},"table":[["月/日","種別","利用場所","種別","利用場所","残額","差額"],["05/01","入","yyy","出","xxx","¥127","-406"],["05/01","入","xxx","出","yyy","¥533","-406"]]}},"url":"https://www.mobile.pasmo.jp/iq/ir/SuicaDisp.aspx?returnId=SFRCMMEPC03"}
```

### Lambdaテスト
```
{
  "Records": [
{
  "body": "{\"id\":\"testuser\",\"dataType\":\"card1#history#parsed\",\"timestamp\":\"1714363438\",\"result\":{\"head\":{\"title\":\"モバイルPASMO＞SF（電子マネー）残額履歴\"},\"body\":{\"select\":{\"selected\":\"2024/05\"},\"table\":[[\"月/日\",\"種別\",\"利用場所\",\"種別\",\"利用場所\",\"残額\",\"差額\"],[\"05/01\",\"入\",\"yyy\",\"出\",\"xxx\",\"¥127\",\"-406\"],[\"05/01\",\"入\",\"xxx\",\"出\",\"yyy\",\"¥533\",\"-406\"]]}},\"url\":\"https://www.mobile.pasmo.jp/iq/ir/SuicaDisp.aspx?returnId=SFRCMMEPC03\"}"
}
  ]
}


```

## 参考
- https://engineering.nifty.co.jp/blog/20337
- https://zenn.dev/simsim/articles/42cb71cec493f8
