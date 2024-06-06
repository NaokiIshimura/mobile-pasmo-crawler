/**
 * Authorizer Lambda Function
 * API Gatewayのカスタムオーソライザーとして使用するLambda関数
 * リクエスト元のIPアドレスをチェックし、許可されたIPアドレスの場合のみAPI Gatewayのリクエストを許可する
 */
export const handler = async (event, context) => {
  // デバッグ用
  // console.log('event', event);
  // console.log('sourceIp', event.requestContext.http.sourceIp);
  // console.log('method', event.requestContext.http.method);
  // console.log('authorization', event.headers.authorization);

  // 許可するAuthorizationヘッダー
  const auth_token = process.env.AUTH_TOKEN;

  // CORSプリフライトリクエストではない場合、
  // かつ、
  // Authorizationヘッダーが設定されていない場合は拒否
  if (event.requestContext.http.method != "OPTIONS" && event.headers.authorization != auth_token) {
    return false;
  }

  // アクセスを許可するIPアドレス（"xxx.xxx.xxx.xxx/32"）
  const allow_ip_address = process.env.ALLOW_IP_ADDRESS;

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
                allow_ip_address
              ]
            }
          }
        }
      ]
    }
  }
  return response;
};
