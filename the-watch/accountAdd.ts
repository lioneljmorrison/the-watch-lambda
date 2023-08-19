import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Account } from './interfaces';
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
    const params = event.queryStringParameters;

    try {
        const data: Account = {
            id: params?.accountId as string,
            company: params?.companyName as string,
            created: Date.now().toString(),
        };

        const command = new PutCommand({
            TableName: 'account',
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
