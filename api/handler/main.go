package handler

import (
	"authorizer-api/server"
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambdaV2

func init() {
	// stdout and stderr are sent to AWS CloudWatch Logs
	log.Printf("Gin cold start")

	router := server.GetRouter()
	router.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "world",
		})
	})

	ginLambda = ginadapter.NewV2(router)
}

func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	// log.Printf("Received context: %v", ctx)
	// log.Printf("Received request: %v", req)
	return ginLambda.ProxyWithContext(ctx, req)
}
