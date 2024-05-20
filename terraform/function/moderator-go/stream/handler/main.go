package handler

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(ctx context.Context, sqsEvent events.SQSEvent) error {
	fmt.Println("sqsEvent:", sqsEvent)
	return nil
}
