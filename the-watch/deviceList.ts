import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as crypto from 'crypto-js';
import { OpenAPIConfig } from './interfaces';
import { SwitchbotAuth } from './switchbot';

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
    const config: OpenAPIConfig = {
        secret: process.env.SECRET || '',
        token: process.env.TOKEN || '',
        nonce: process.env.NONCE || '',
    };

    const switchbot = new SwitchbotAuth(config);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: switchbot.fetchHeaderDeviceList,
        redirect: 'follow',
    };

    try {
        const deviceListData = await fetch(`${process.env.URI}/${process.env.VER}/devices`, requestOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data: JSON.parse(await deviceListData.text()),
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
