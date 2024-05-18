package main

import (
	"fmt"

	"go-lambda-sample/handler"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	fmt.Println("start! >>>")
	lambda.Start(handler.HandleRequest)
	fmt.Println("<<< end!")
}
