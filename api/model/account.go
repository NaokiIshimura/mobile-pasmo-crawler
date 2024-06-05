package model

import (
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// ==========================================================================================
// struct
// ==========================================================================================

type Account struct {
	ID          string `json:"id" dynamodbav:"id"`
	DataType    string `json:"dataType" dynamodbav:"dataType"`
	MailAddress string `json:"mailAddress" binding:"required" dynamodbav:"mailAddress"`
	Password    string `json:"password" binding:"required" dynamodbav:"password"`
}

// ==========================================================================================
// function
// ==========================================================================================

// DynamoDBの複合キーを返す
func (account Account) GetKey() map[string]types.AttributeValue {
	id, err := attributevalue.Marshal(account.ID)
	if err != nil {
		panic(err)
	}
	dataType, err := attributevalue.Marshal(account.DataType)
	if err != nil {
		panic(err)
	}
	return map[string]types.AttributeValue{"id": id, "dataType": dataType}
}
