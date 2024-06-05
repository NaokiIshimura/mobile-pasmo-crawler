package repository

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// ==========================================================================================
// struct
// ==========================================================================================

type TableBasics struct {
	DynamoDbClient *dynamodb.Client
	TableName      string
}

// ==========================================================================================
// Global variable
// ==========================================================================================

var tableName = os.Getenv("TABLE_NAME")
var tableBasics TableBasics

// ==========================================================================================
// init
// ==========================================================================================

func init() {
	// DynamoDB Client
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("ap-northeast-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}
	dynamoClient := dynamodb.NewFromConfig(cfg)

	// DynamoDB操作を行うためのTableBasicsの初期化
	tableBasics = TableBasics{
		DynamoDbClient: dynamoClient,
		TableName:      tableName,
	}
}

func GetTableBasics() TableBasics {
	return tableBasics
}
