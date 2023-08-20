import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { switchbot } from './utility';
import { DeviceHookResponse, LogDeviceStatus } from './interfaces';
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
    const status: DeviceHookResponse = JSON.parse(event.body as string);

    try {
        const data: LogDeviceStatus = {
            created: Date.now().toString(),
            accountId: params?.accountId as string,
            deviceId: status.context.deviceMac,
            deviceType: status.context.deviceType,
            humidity: status.context.humidity,
            temperature: status.context.temperature,
            battery: status.context.battery,
        };

        const command = new PutCommand({
            TableName: 'logs',
            Item: data,
        });

        const response = await docClient.send(command);

        if (!response) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: `Failed to log status for ${params}`,
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data,
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
