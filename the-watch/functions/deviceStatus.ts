import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { switchbot } from '../utility';
import { LogDeviceStatus } from '../interfaces';
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
    const routeParams = event.pathParameters;

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: switchbot.fetchHeaderDeviceList,
        redirect: 'follow',
    };

    try {
        const deviceData = await fetch(
            `${process.env.URI}/${process.env.VER}/devices/${routeParams?.deviceId}/status`,
            requestOptions,
        );

        const data: LogDeviceStatus = {
            created: Date.now().toString(),
            accountId: routeParams?.accountId,
            ...(await deviceData.json()).body,
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
                    message: `Failed to log status for ${routeParams}`,
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
