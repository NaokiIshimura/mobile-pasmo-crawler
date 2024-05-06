package main

import (
	// (一部抜粋)
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"

	moderatorpb "sample/pkg/grpc"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type myServer struct {
	moderatorpb.UnimplementedHistoriesServiceServer
}

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

func (s *myServer) GetHistories(ctx context.Context, req *moderatorpb.HistoriesRequest) (*moderatorpb.HistoriesResponse, error) {

	// DynamoDBからItemsを取得する
	histories, err := queryItems(req.GetId(), req.GetCard())
	if err != nil {
		return nil, err
	}
	// []*sample/pkg/grpc.History に変換
	var grpcHistories []*moderatorpb.History
	for _, history := range histories {
		grpcHistory := &moderatorpb.History{
			ID:       history.ID,
			DataType: history.DataType,
			Category: history.Category,
			Date:     history.Date,
			Value:    int32(history.Value),
			Detail: &moderatorpb.Detail{
				In:  history.Detail.In,
				Out: history.Detail.Out,
			},
		}
		grpcHistories = append(grpcHistories, grpcHistory)
	}
	return &moderatorpb.HistoriesResponse{
		Histories: grpcHistories,
	}, nil
}

// 自作サービス構造体のコンストラクタを定義
func NewMyServer() *myServer {
	return &myServer{}
}

func main() {
	// 1. 8081番portのLisnterを作成
	port := 8081
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}

	// 2. gRPCサーバーを作成
	s := grpc.NewServer()

	// 3. gRPCサーバーにGreetingServiceを登録
	moderatorpb.RegisterHistoriesServiceServer(s, NewMyServer())

	// 4. サーバーリフレクションの設定
	reflection.Register(s)

	// 3. 作成したgRPCサーバーを、8081番ポートで稼働させる
	go func() {
		log.Printf("start gRPC server port: %v", port)
		s.Serve(listener)
	}()

	// 4.Ctrl+Cが入力されたらGraceful shutdownされるようにする
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("stopping gRPC server...")
	s.GracefulStop()
}

// DynamoDBからItemsを取得する
func queryItems(id string, card string) ([]Item, error) {

	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "ap-northeast-1"
		return nil
	})
	if err != nil {
		panic(err)
	}

	svc := dynamodb.NewFromConfig(cfg)
	p := dynamodb.NewQueryPaginator(svc, &dynamodb.QueryInput{
		TableName:              aws.String("mpc-default-moderator-table"),
		Limit:                  aws.Int32(30),
		KeyConditionExpression: aws.String("id = :id and begins_with(dataType, :card)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":id": &types.AttributeValueMemberS{
				Value: id,
			},
			":card": &types.AttributeValueMemberS{
				Value: card + "#history#",
			},
		},
	})

	var items []Item
	for p.HasMorePages() {
		out, err := p.NextPage(context.TODO())
		if err != nil {
			panic(err)
		}

		var pItems []Item
		err = attributevalue.UnmarshalListOfMaps(out.Items, &pItems)
		if err != nil {
			panic(err)
		}

		items = append(items, pItems...)
	}

	return items, nil
}
