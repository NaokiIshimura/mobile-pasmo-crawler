package server

import (
	"authorizer-api/controller"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// ==========================================================================================
// main
// ==========================================================================================

// APIサーバを起動する
func Start() {

	fmt.Println("start API Server")

	// APIサーバ
	router := gin.Default()

	// CORS設定
	router.Use(cors.New(cors.Config{
		// アクセス許可するオリジン
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		// アクセス許可するHTTPメソッド
		AllowMethods: []string{
			"GET",
			"POST",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Content-Type",
		},
	}))

	// ルーティング
	router.GET("/accounts/:account", controller.GetAccount)
	router.POST("/accounts/:account", controller.PostAccount)
	router.GET("/accounts/:account/authImage", controller.GetAuthImage)
	router.POST("/accounts/:account/authImage", controller.PostAuthImage)

	// ポート
	router.Run(":8080")
}
