package model

import (
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// ==========================================================================================
// struct
// ==========================================================================================

type AuthImage struct {
	ID       string `json:"id" dynamodbav:"id"`
	DataType string `json:"dataType" dynamodbav:"dataType"`
	Binary   string `json:"binary" dynamodbav:"binary"`
	Text     string `json:"text" binding:"required" dynamodbav:"text"`
}

// ==========================================================================================
// function
// ==========================================================================================

// DynamoDBの複合キーを返す
func (authImage AuthImage) GetKey() map[string]types.AttributeValue {
	id, err := attributevalue.Marshal(authImage.ID)
	if err != nil {
		panic(err)
	}
	dataType, err := attributevalue.Marshal(authImage.DataType)
	if err != nil {
		panic(err)
	}
	return map[string]types.AttributeValue{"id": id, "dataType": dataType}
}
