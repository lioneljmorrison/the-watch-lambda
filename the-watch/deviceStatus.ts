import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SwitchbotAuth } from './switchbot';
import { DeviceStatus, deviceStatusParameters } from './interfaces';

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
    const switchbot = new SwitchbotAuth({
        secret: process.env.SECRET || '',
        token: process.env.TOKEN || '',
        nonce: process.env.NONCE || '',
    });

    const routeParams = event.pathParameters?.device;

    console.log(routeParams);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: switchbot.fetchHeaderDeviceList,
        redirect: 'follow',
    };

    try {
        const deviceData = await fetch(
            `${process.env.URI}/${process.env.VER}/devices/${routeParams}/status`,
            requestOptions,
        );

        const data: DeviceStatus = await deviceData.json();

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
