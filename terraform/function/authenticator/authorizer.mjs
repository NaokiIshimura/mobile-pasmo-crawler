/**
 * Authorizer Lambda Function
 * API Gatewayのカスタムオーソライザーとして使用するLambda関数
 * リクエスト元のIPアドレスをチェックし、許可されたIPアドレスの場合のみAPI Gatewayのリクエストを許可する
 */
export const handler = async (event, context) => {
  // デバッグ用
  // console.log('event', event);
  // const sourceIp = event.requestContext.http.sourceIp;
  // console.log('sourceIp', sourceIp);

  const response = {
    principalId: "AllowExecuteApiInvoke",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "execute-api:Invoke",
          Resource: event.routeArn,
          Condition: {
            IpAddress: {
              "aws:SourceIp": [
                "150.246.60.77/32"
              ]
            }
          }
        }
      ]
    }
  }
  return response;
};
