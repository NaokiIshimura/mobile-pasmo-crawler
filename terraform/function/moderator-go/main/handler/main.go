package handler

import (
	"context"
	"encoding/json"
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
	fmt.Println("HandleRequest! >>>")

	fmt.Println("sqsEvent:", sqsEvent)
	// レコード (メッセージ) 単位でループ
	for _, record := range sqsEvent.Records {
		fmt.Println("record:", record)
		// インプットメッセージを受け取って構造体にマッピング
		b := []byte(record.Body)
		var input Input
		err := json.Unmarshal(b, &input)
		if err != nil {
			fmt.Printf("%s\n", err)
		}
		Test1(input)
		// PrintJson(input)

	}

	fmt.Println("<<< HandleRequest!")
	// message := fmt.Sprintf("Hello!!")
	return nil
}
