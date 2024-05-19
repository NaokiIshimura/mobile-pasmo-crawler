import { LambdaClient } from "@aws-sdk/client-lambda";

const region = process.env.NEXT_PUBLIC_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Environment variables for AWS credentials are not set properly');
}

export const client = new LambdaClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    },
});

const crawlerFunctionName = process.env.NEXT_PUBLIC_CRAWLER_FUNCTION_NAME;

if (!crawlerFunctionName) {
    throw new Error('Function name environment variables are not set properly');
}

export {
    crawlerFunctionName
};
