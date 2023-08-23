import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeviceI, DeviceImport } from '../interfaces';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const params = event.pathParameters;
    const devices: DeviceImport[] = JSON.parse(event.body as string);

    try {
        for (const device of devices) {
            const data: DeviceI = {
                ...device,
                accountId: params?.accountId as string,
                created: Date.now().toString(),
            };

            const command = new PutCommand({
                TableName: 'devices',
                Item: data,
            });

            await docClient.send(command);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
