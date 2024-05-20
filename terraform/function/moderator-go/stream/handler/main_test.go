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
				ctx: context.TODO(),
				sqsEvent: events.SQSEvent{
					Records: []events.SQSMessage{
						{
							Body: "{\"foo\":\"bar\"}",
						},
					},
				},
			},
			wantErr: false,
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
