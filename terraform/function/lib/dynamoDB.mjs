import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import moment from "moment";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABNE_NAME = process.env.TABLE_NAME

export const setAuthImageBinary = async (id, base64) => {
    const command = new PutCommand({
        TableName: TABNE_NAME,
        Item: {
            id: id,
            dataType: 'authImage',
            binary: base64,
            text: ''
        }
    });

    const response = await docClient.send(command);
    // console.log(response);
    // return response;
};

export const removeAuthImageBinaryAndText = async (id) => {
    const command = new DeleteCommand({
        TableName: TABNE_NAME,
        Key: {
            id: id,
            dataType: 'authImage',
        },
    });

    const response = await docClient.send(command);
    // console.log(response);
    // return response;
};

export const getAccount = async (id) => {
    const command = new GetCommand({
        TableName: TABNE_NAME,
        Key: {
            id: id,
            dataType: 'account'
        },
    });

    const { Item } = await docClient.send(command);
    // console.log(Item);
    return { mailAddress: Item.mailAddress, password: Item.password };
}

export const getAuthImage = async (id) => {
    const command = new GetCommand({
        TableName: TABNE_NAME,
        Key: {
            id: id,
            dataType: 'authImage'
        },
    });

    const { Item } = await docClient.send(command);
    // console.log(Item);
    return { binary: Item.binary, text: Item.text }
}

export const putSource = async (id, source) => {
    const command = new PutCommand({
        TableName: TABNE_NAME,
        Item: {
            id: id,
            dataType: 'source',
            html: source.replace(/\t|\n/g, ''),
            timestamp: moment().unix(),
        }
    });

    const response = await docClient.send(command);
    // console.log(response);
    // return response;
}

export const getSource = async (id) => {
    const command = new GetCommand({
        TableName: TABNE_NAME,
        Key: {
            id: id,
            dataType: 'source',
        }
    });

    const { Item } = await docClient.send(command);
    // console.log(Item);
    return { html: Item.html };
}