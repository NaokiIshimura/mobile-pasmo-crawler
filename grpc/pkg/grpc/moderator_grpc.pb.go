// protoのバージョンの宣言

// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v5.26.1
// source: moderator.proto

// packageの宣言

package grpc

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	HistoriesService_Hello_FullMethodName = "/myapp.HistoriesService/Hello"
)

// HistoriesServiceClient is the client API for HistoriesService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type HistoriesServiceClient interface {
	// サービスが持つメソッドの定義
	Hello(ctx context.Context, in *HistoriesRequest, opts ...grpc.CallOption) (*HistoriesResponse, error)
}

type historiesServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewHistoriesServiceClient(cc grpc.ClientConnInterface) HistoriesServiceClient {
	return &historiesServiceClient{cc}
}

func (c *historiesServiceClient) Hello(ctx context.Context, in *HistoriesRequest, opts ...grpc.CallOption) (*HistoriesResponse, error) {
	out := new(HistoriesResponse)
	err := c.cc.Invoke(ctx, HistoriesService_Hello_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// HistoriesServiceServer is the server API for HistoriesService service.
// All implementations must embed UnimplementedHistoriesServiceServer
// for forward compatibility
type HistoriesServiceServer interface {
	// サービスが持つメソッドの定義
	Hello(context.Context, *HistoriesRequest) (*HistoriesResponse, error)
	mustEmbedUnimplementedHistoriesServiceServer()
}

// UnimplementedHistoriesServiceServer must be embedded to have forward compatible implementations.
type UnimplementedHistoriesServiceServer struct {
}

func (UnimplementedHistoriesServiceServer) Hello(context.Context, *HistoriesRequest) (*HistoriesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Hello not implemented")
}
func (UnimplementedHistoriesServiceServer) mustEmbedUnimplementedHistoriesServiceServer() {}

// UnsafeHistoriesServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to HistoriesServiceServer will
// result in compilation errors.
type UnsafeHistoriesServiceServer interface {
	mustEmbedUnimplementedHistoriesServiceServer()
}

func RegisterHistoriesServiceServer(s grpc.ServiceRegistrar, srv HistoriesServiceServer) {
	s.RegisterService(&HistoriesService_ServiceDesc, srv)
}

func _HistoriesService_Hello_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(HistoriesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(HistoriesServiceServer).Hello(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: HistoriesService_Hello_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(HistoriesServiceServer).Hello(ctx, req.(*HistoriesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// HistoriesService_ServiceDesc is the grpc.ServiceDesc for HistoriesService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var HistoriesService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "myapp.HistoriesService",
	HandlerType: (*HistoriesServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Hello",
			Handler:    _HistoriesService_Hello_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "moderator.proto",
}
