package server

import (
	"authorizer-api/controller"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// ==========================================================================================
// function
// ==========================================================================================

// APIサーバを起動する
func Start() {

	fmt.Println("start API Server")

	// Routerを設定する
	router := GetRouter()

	// サーバを起動する
	router.Run(":8080")
}

// Routerを設定する
func GetRouter() *gin.Engine {
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

	return router
}
