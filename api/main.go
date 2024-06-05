package main

import (
	"authorizer-api/handler"
	"authorizer-api/server"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	// Lambda上で起動された場合（環境変数AWS_LAMBDA_FUNCTION_NAMEが存在する場合）、Hadlerを呼び出す
	// それ以外の場合は、サーバを起動する
	if _, exists := os.LookupEnv("AWS_LAMBDA_FUNCTION_NAME"); exists {
		fmt.Println("lambda function")
		lambda.Start(handler.Handler)
	} else {
		fmt.Println("local")
		server.Start()
	}
}
