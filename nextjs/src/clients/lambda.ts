import { LambdaClient } from "@aws-sdk/client-lambda";

export const client = new LambdaClient({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY
        , secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
    },
});

export const functionName = process.env.NEXT_PUBLIC_FUNCTION_NAME;
export const crawlerFunctionName = process.env.NEXT_PUBLIC_CRAWLER_FUNCTION_NAME;
