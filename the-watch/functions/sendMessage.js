import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

export const lambdaHandler = async function (event, context, callback) {
    const clientDB = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(clientDB);
    const apiClient = new ApiGatewayManagementApiClient({
        // endpoint: event.requestContext.domainName + '/' + event.requestContext.stage,
        endpoint: 'https://v9e2el2mme.execute-api.us-east-2.amazonaws.com/production',
    });

    const latestCommand = new QueryCommand({
        TableName: 'latest',
        KeyConditionExpression: 'accountId = :account',
        ExpressionAttributeValues: {
            ':account': { S: 'HCC' },
        },
        ConsistentRead: true,
    });

    const latestData = await docClient.send(latestCommand);

    const scanParams = new ScanCommand({
        ProjectionExpression: 'connectionId',
        TableName: 'the-watch-websocket',
    });

    const connClients = await docClient.send(scanParams);
    const postCalls = connClients.Items.map(async (item) => {
        const response = new PostToConnectionCommand({
            Data: JSON.stringify(latestData.Items),
            ConnectionId: item.connectionId,
        });
        await apiClient.send(response);
    });

    try {
        await Promise.all(postCalls);
    } catch (e) {
        return {
            statusCode: 501,
            body: e.stack,
        };
    }

    return { statusCode: 200, body: 'Event sent.' };
};
