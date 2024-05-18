package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type Detail struct {
	In  string `dynamodbav:"in"`
	Out string `dynamodbav:"out"`
}

type Item struct {
	ID       string `dynamodbav:"id"`
	DataType string `dynamodbav:"dataType"`
	Category string `dynamodbav:"category"`
	Date     string `dynamodbav:"date"`
	Value    int    `dynamodbav:"value"`
	Detail   Detail `dynamodbav:"detail"`
}

// デバッグ用
// Inputの内容をログ出力する
func PrintInput(input Input) error {
	fmt.Println("PrintInput >>>")
	fmt.Println("input:", input)
	fmt.Println("input.ID:", input.ID)
	fmt.Println("input.DataType:", input.DataType)
	fmt.Println("input.Timestamp:", input.Timestamp)
	fmt.Println("input.URL:", input.URL)
	fmt.Println("input.Result.Head:", input.Result.Head)
	fmt.Println("input.Result.Body.Select.Selected:", input.Result.Body.Select.Selected)
	fmt.Println("<<< PrintInput")
	return nil
}

// SQSメッセージを構造体にマッピングする
func mapBodyToInput(body string) (Input, error) {
	var input Input
	err := json.Unmarshal([]byte(body), &input)
	return input, err
}

// InputデータをDynamoDBに書き込む
func WriteInputData(input Input) error {
	// fmt.Println("input:", input)
	for index, record := range input.Result.Body.Table {

		fmt.Print("index:", index)
		fmt.Println(" / record:", record)

		if index > 0 {
			// detailをセットする
			detail, err := SetDetail(record)
			if err != nil {
				panic(err)
			}
			// fmt.Println("detail:", detail)

			// itemを生成する
			item, err := SetItem(index, input, record, detail)
			if err != nil {
				panic(err)
			}
			// fmt.Println("item:", item)

			// itemをDynamoDBへ書き込む
			PutItem(item)
		}
	}
	return nil
}

func SetDetail(record []interface{}) (Detail, error) {

	// 型アサーションを使って interface{} を string に変換
	in, ok := record[2].(string)
	if !ok {
		return Detail{}, fmt.Errorf("failed to convert record[2] to string")
	}
	out, ok := record[4].(string)
	if !ok {
		return Detail{}, fmt.Errorf("failed to convert record[4] to string")
	}

	var detail Detail
	detail.In = in
	detail.Out = out

	return detail, nil
}

func SetItem(index int, input Input, record []interface{}, detail Detail) (Item, error) {

	// fmt.Println("SetItem:", index)
	// fmt.Println("SetItem:", input)
	// fmt.Println("SetItem:", record)
	// fmt.Println("SetItem:", detail)

	date, ok := record[0].(string)
	if !ok {
		return Item{}, fmt.Errorf("failed to convert record[0] to string")
	}

	var valueStr string

	if record[1] == "ｶｰﾄﾞ" {
		// record[5]の値を取得し、正の数に変換する
		valueStr, ok = record[5].(string)
		if !ok {
			return Item{}, fmt.Errorf("failed to convert record[5] to string")
		}
	} else {
		// record[6]の値を取得し、正の数に変換する
		valueStr, ok = record[6].(string)
		if !ok {
			return Item{}, fmt.Errorf("failed to convert record[6] to string")
		}
	}

	// カンマを削除
	valueStr = strings.Replace(valueStr, ",", "", -1)
	// プラス記号を削除
	valueStr = strings.Replace(valueStr, "+", "", -1)
	// ¥記号を削除
	valueStr = strings.Replace(valueStr, "¥", "", -1)
	// int型に変換
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return Item{}, fmt.Errorf("failed to convert value to int: %v", err)
	}
	if value < 0 {
		value = -value // 負の数を正に変換する
	}

	// fmt.Println("value:", value)

	var item Item
	item.ID = input.ID
	item.DataType = "card1#history#" + strings.ReplaceAll(input.Result.Body.Select.Selected, "/", "") + "#" + fmt.Sprintf("%04d", index)
	item.Date = date

	if record[1] == "物販" {
		item.Category = "物販"
	} else if record[1] == "ｶｰﾄﾞ" {
		item.Category = "チャージ"
	} else {
		item.Category = "運賃"
	}

	item.Value = value
	item.Detail = detail

	return item, nil
}

func PutItem(item Item) error {
	// fmt.Println("putItem:", item)

	detailMap := map[string]types.AttributeValue{
		"in":  &types.AttributeValueMemberS{Value: item.Detail.In},
		"out": &types.AttributeValueMemberS{Value: item.Detail.Out},
	}

	var TableName = os.Getenv("TABLE_NAME")
	// fmt.Println("TableName:", TableName)

	// PutItem入力の作成
	input := &dynamodb.PutItemInput{
		Item: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{
				Value: item.ID,
			},
			"dataType": &types.AttributeValueMemberS{
				Value: item.DataType,
			},
			"category": &types.AttributeValueMemberS{
				Value: item.Category,
			},
			"date": &types.AttributeValueMemberS{
				Value: item.Date,
			},
			"value": &types.AttributeValueMemberN{
				Value: strconv.Itoa(item.Value),
			},
			"detail": &types.AttributeValueMemberM{
				Value: detailMap,
			},
		},
		TableName: aws.String(TableName),
	}

	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "ap-northeast-1"
		return nil
	})
	if err != nil {
		panic(err)
	}

	svc := dynamodb.NewFromConfig(cfg)

	_, err = svc.PutItem(context.TODO(), input)
	if err != nil {
		panic(err)
	}

	return nil
}
