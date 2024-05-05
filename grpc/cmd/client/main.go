package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	moderatorpb "sample/pkg/grpc"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Detail struct {
	In  string `json:"in"`
	Out string `json:"out"`
}

type Item struct {
	ID       string `json:"id"`
	DataType string `json:"dataType"`
	Category string `json:"category"`
	Date     string `json:"date"`
	Value    int    `json:"value"`
	Detail   Detail `json:"detail"`
}

var (
	client moderatorpb.HistoriesServiceClient
)

func main() {
	fmt.Println("start gRPC Client.")

	// gRPCサーバーとのコネクションを確立
	// address := "localhost:8081"
	// Dockerコンテナからホストへアクセスする場合は、以下をコメントアウトする
	// address := "host.docker.internal:8081"
	// DockerComposeで起動してる場合は、以下をコメントアウトする
	address := "server:8081"
	conn, err := grpc.Dial(
		address,

		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		log.Fatal("Connection failed.")
		return
	}
	defer conn.Close()

	// gRPCクライアントを生成
	client = moderatorpb.NewHistoriesServiceClient(conn)

	// APIサーバ
	router := gin.Default()

	// https://qiita.com/ichi_zamurai/items/97e7e93bf398f98e719e
	router.Use(cors.New(cors.Config{
		// アクセス許可するオリジン
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		// アクセス許可するHTTPメソッド
		AllowMethods: []string{
			"GET",
		},
	}))

	router.GET("/accounts/:account/cards/:card/histories", func(c *gin.Context) {
		account := c.Param("account")
		card := c.Param("card")
		// GetHistories関数を呼び出す
		json, err := getHistories(account, card)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.Data(http.StatusOK, "application/json; charset=utf-8", json)
	})
	router.Run(":8080")
}

func getHistories(id string, card string) ([]byte, error) {

	req := &moderatorpb.HistoriesRequest{
		Id:   id,
		Card: card,
	}
	res, err := client.GetHistories(context.Background(), req)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	// レスポンスの配列から1つずつ取り出して出力
	// for _, history := range res.GetHistories() {
	// 	fmt.Println(history)
	// }

	// レスポンスの配列から1つずつ取り出してItemにマッピング
	var items []Item
	for _, history := range res.GetHistories() {
		item := mapToItem(history)
		items = append(items, item)
	}

	// レスポンスをJSONに変換
	jsonData, err := json.Marshal(items)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("json:")
	fmt.Printf("%s\n", jsonData)

	return jsonData, nil
}

// grpcのレスポンスをJSONに変換したとき
// ローわーキャメルになるようにItem型に変換する
func mapToItem(history *moderatorpb.History) Item {
	return Item{
		ID:       history.ID,
		DataType: history.DataType,
		Category: history.Category,
		Date:     history.Date,
		Value:    int(history.Value),
		Detail: Detail{
			In:  history.Detail.In,
			Out: history.Detail.Out,
		},
	}
}
