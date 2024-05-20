package handler

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

type Result struct {
	Head struct {
		Title string `json:"title"`
	} `json:"head"`
	Body struct {
		Select struct {
			Selected string `json:"selected"`
		} `json:"select"`
		Table [][]interface{} `json:"table"`
	} `json:"body"`
}

type Input struct {
	ID        string `json:"id"`
	DataType  string `json:"dataType"`
	Timestamp string `json:"timestamp"`
	URL       string `json:"url"`
	Result    Result `json:"result"`
}

func HandleRequest(ctx context.Context, sqsEvent events.SQSEvent) error {
	fmt.Println("sqsEvent:", sqsEvent)
	// レコード (SQSメッセージ) 単位でループさせる
	for _, record := range sqsEvent.Records {
		// fmt.Println("record:", record)

		// SQSメッセージを構造体にマッピングする
		input, err := mapBodyToInput(record.Body)
		if err != nil {
			fmt.Printf("Error mapBodyToInput: %s\n", err)
			continue
		}

		// Inputの内容をログ出力する
		// PrintInput(input)

		// InputデータをDynamoDBに書き込む
		err = WriteInputData(input)
		if err != nil {
			fmt.Printf("Error WriteInputData: %s\n", err)
			continue
		}
	}
	return nil
}
