import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

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

    try {
        if (params?.accountId) {
            const latestData = new QueryCommand({
                TableName: 'devices',
                KeyConditionExpression: 'accountId = :account',
                ExpressionAttributeValues: {
                    ':account': { S: params.accountId },
                },
                ConsistentRead: true,
            });

            const response = await docClient.send(latestData);

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
                    data: response.Items,
                }),
            };
        }
        throw 'Something went wrong';
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }
};