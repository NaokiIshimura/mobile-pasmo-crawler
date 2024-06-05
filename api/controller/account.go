package controller

import (
	"encoding/json"
	"net/http"

	"authorizer-api/model"
	"authorizer-api/repository"

	"github.com/gin-gonic/gin"
)

// ==========================================================================================
// struct
// ==========================================================================================

type Account = model.Account

// ==========================================================================================
// Controller
// ==========================================================================================

func GetAccount(c *gin.Context) {
	// URLパラメータからIDを取得
	id := c.Param("account")
	// dataTypeに「account」を設定
	dataType := "account"
	// アカウント情報を取得する
	tableBasics := repository.GetTableBasics()
	accountData, err := tableBasics.GetAccount(id, dataType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// パスワードをマスクする
	accountData.Password = "*****"
	// レスポンスJSONを返す
	jsonData, err := json.Marshal(accountData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", jsonData)
}

func PostAccount(c *gin.Context) {
	var account Account
	// URLパラメータからIDを取得
	account.ID = c.Param("account")
	// dataTypeに「account」を設定
	account.DataType = "account"
	// JSONデータをAccount構造体にバインド
	if err := c.ShouldBindJSON(&account); err != nil {
		// バインドに失敗した場合、エラーレスポンスを返す
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// アカウント情報を追加する
	tableBasics := repository.GetTableBasics()
	err := tableBasics.AddAccount(account)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// レスポンスJSONを返す
	jsonData, err := json.Marshal(account)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", jsonData)
}
