package repository

import (
	"authorizer-api/model"
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

// ==========================================================================================
// struct
// ==========================================================================================

type Account = model.Account

// ==========================================================================================
// function
// ==========================================================================================

// アカウント情報を取得する
func (basics TableBasics) GetAccount(id string, dataType string) (Account, error) {
	account := Account{ID: id, DataType: dataType}
	response, err := basics.DynamoDbClient.GetItem(context.TODO(), &dynamodb.GetItemInput{
		Key:       account.GetKey(),
		TableName: aws.String(basics.TableName),
	})
	if err != nil {
		log.Printf("Couldn't get info about %v. Here's why: %v\n", id, err)
		return Account{}, err
	}
	if response.Item == nil {
		log.Printf("No item found for key: %v\n", account.GetKey())
		return Account{}, fmt.Errorf("no item found for key: %v", account.GetKey())
	}
	if err := attributevalue.UnmarshalMap(response.Item, &account); err != nil {
		log.Printf("Couldn't unmarshal response. Here's why: %v\n", err)
		return Account{}, err
	}
	return account, nil
}

// アカウント情報を追加する
func (basics TableBasics) AddAccount(account Account) error {
	item, err := attributevalue.MarshalMap(account)
	if err != nil {
		panic(err)
	}
	_, err = basics.DynamoDbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String(basics.TableName), Item: item,
	})
	if err != nil {
		log.Printf("Couldn't add item to table. Here's why: %v\n", err)
	}
	return err
}
