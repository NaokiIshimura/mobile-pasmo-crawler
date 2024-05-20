package main

import (
	"go-lambda-sample/handler"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handler.HandleRequest)
}
