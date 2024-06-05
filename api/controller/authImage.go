package controller

import (
	"authorizer-api/model"
	"authorizer-api/repository"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ==========================================================================================
// struct
// ==========================================================================================

type AuthImage = model.AuthImage

// ==========================================================================================
// Controller
// ==========================================================================================

func GetAuthImage(c *gin.Context) {
	// URLパラメータからIDを取得
	id := c.Param("account")
	// dataTypeに「account」を設定
	dataType := "authImage"
	// アカウント情報を取得する
	tableBasics := repository.GetTableBasics()
	accountData, err := tableBasics.GetAuthImage(id, dataType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// レスポンスJSONを返す
	jsonData, err := json.Marshal(accountData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", jsonData)
}

func PostAuthImage(c *gin.Context) {
	var authImage AuthImage
	// URLパラメータからIDを取得
	authImage.ID = c.Param("account")
	// dataTypeに「account」を設定
	authImage.DataType = "authImage"
	// JSONデータをAccount構造体にバインド
	if err := c.ShouldBindJSON(&authImage); err != nil {
		// バインドに失敗した場合、エラーレスポンスを返す
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// アカウント情報を追加する
	tableBasics := repository.GetTableBasics()
	err := tableBasics.AddAuthImage(authImage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// レスポンスJSONを返す
	jsonData, err := json.Marshal(authImage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", jsonData)
}

//==========================================================================================
// Repository
//==========================================================================================

// // 認証画像情報を取得する
// func (basics TableBasics) GetAuthImage(id string, dataType string) (AuthImage, error) {
// 	authImage := AuthImage{ID: id, DataType: dataType}
// 	response, err := basics.DynamoDbClient.GetItem(context.TODO(), &dynamodb.GetItemInput{
// 		Key:       authImage.GetKey(),
// 		TableName: aws.String(basics.TableName),
// 	})
// 	if err != nil {
// 		log.Printf("Couldn't get info about %v. Here's why: %v\n", id, err)
// 		return AuthImage{}, err
// 	}
// 	if response.Item == nil {
// 		log.Printf("No item found for key: %v\n", authImage.GetKey())
// 		return AuthImage{}, fmt.Errorf("no item found for key: %v", authImage.GetKey())
// 	}
// 	if err := attributevalue.UnmarshalMap(response.Item, &authImage); err != nil {
// 		log.Printf("Couldn't unmarshal response. Here's why: %v\n", err)
// 		return AuthImage{}, err
// 	}
// 	return authImage, nil
// }

// // 認証画像情報を追加する
// func (basics TableBasics) AddAuthImage(authImage AuthImage) error {
// 	item, err := attributevalue.MarshalMap(authImage)
// 	if err != nil {
// 		panic(err)
// 	}
// 	_, err = basics.DynamoDbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
// 		TableName: aws.String(basics.TableName), Item: item,
// 	})
// 	if err != nil {
// 		log.Printf("Couldn't add item to table. Here's why: %v\n", err)
// 	}
// 	return err
// }

// func (authImage AuthImage) GetKey() map[string]types.AttributeValue {
// 	id, err := attributevalue.Marshal(authImage.ID)
// 	if err != nil {
// 		panic(err)
// 	}
// 	dataType, err := attributevalue.Marshal(authImage.DataType)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return map[string]types.AttributeValue{"id": id, "dataType": dataType}
// }
