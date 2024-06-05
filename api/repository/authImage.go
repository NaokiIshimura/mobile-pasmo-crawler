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

type AuthImage = model.AuthImage

// ==========================================================================================
// function
// ==========================================================================================

// 認証画像情報を取得する
func (basics TableBasics) GetAuthImage(id string, dataType string) (AuthImage, error) {
	authImage := AuthImage{ID: id, DataType: dataType}
	response, err := basics.DynamoDbClient.GetItem(context.TODO(), &dynamodb.GetItemInput{
		Key:       authImage.GetKey(),
		TableName: aws.String(basics.TableName),
	})
	if err != nil {
		log.Printf("Couldn't get info about %v. Here's why: %v\n", id, err)
		return AuthImage{}, err
	}
	if response.Item == nil {
		log.Printf("No item found for key: %v\n", authImage.GetKey())
		return AuthImage{}, fmt.Errorf("no item found for key: %v", authImage.GetKey())
	}
	if err := attributevalue.UnmarshalMap(response.Item, &authImage); err != nil {
		log.Printf("Couldn't unmarshal response. Here's why: %v\n", err)
		return AuthImage{}, err
	}
	return authImage, nil
}

// 認証画像情報を追加する
func (basics TableBasics) AddAuthImage(authImage AuthImage) error {
	item, err := attributevalue.MarshalMap(authImage)
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
