package handler

import (
	"context"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestHandleRequest(t *testing.T) {
	type args struct {
		ctx      context.Context
		sqsEvent events.SQSEvent
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Test case 1",
			args: args{
				ctx: context.TODO(), // または必要に応じて適切なコンテキストを作成する
				sqsEvent: events.SQSEvent{
					Records: []events.SQSMessage{
						{
							Body: "{\"id\":\"testuser\",\"dataType\":\"card1#history#parsed\",\"timestamp\":\"1714363438\",\"result\":{\"head\":{\"title\":\"モバイルPASMO＞SF（電子マネー）残額履歴\"},\"body\":{\"select\":{\"selected\":\"2024/05\"},\"table\":[[\"月/日\",\"種別\",\"利用場所\",\"種別\",\"利用場所\",\"残額\",\"差額\"],[\"05/01\",\"入\",\"恵比寿\",\"出\",\"新小岩\",\"¥127\",\"-406\"],[\"05/01\",\"入\",\"新小岩\",\"出\",\"恵比寿\",\"¥533\",\"-406\"]]}},\"url\":\"https://www.mobile.pasmo.jp/iq/ir/SuicaDisp.aspx?returnId=SFRCMMEPC03\"}",
						},
					},
				},
			},
			wantErr: false, // テストケースごとに期待されるエラーの有無を設定します
		},
		// ここに新しいテストケースを追加します
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := HandleRequest(tt.args.ctx, tt.args.sqsEvent); (err != nil) != tt.wantErr {
				t.Errorf("HandleRequest() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}