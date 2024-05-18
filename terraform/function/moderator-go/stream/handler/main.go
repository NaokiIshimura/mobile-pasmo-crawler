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
	fmt.Println("HandleRequest! >>>")
	fmt.Println("sqsEvent:", sqsEvent)
	fmt.Println("<<< HandleRequest!")
	// message := fmt.Sprintf("Hello!!")
	return nil
}
