import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as crypto from 'crypto-js';

interface DeviceList {
    statusCode: number;
    body: {
        deviceList: {
            deviceId: string;
            deviceName: string;
            deviceType: string;
            enableCloudService: boolean;
            hubDeviceId: string;
        }[];
    };
    infraredRemoteList: any[];
    message: string;
}

interface OpenAPIConfig {
    switchBotUri: string;
    secret: string;
    token: string;
    nonce: string;
}

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
    /**
     * TODO: This section need to be updated to be updated to take advantage of Lambda Environment Variables
     */

    const config: OpenAPIConfig = {
        switchBotUri: process.env.URI || '',
        secret: process.env.SECRET || '',
        token: process.env.TOKEN || '',
        nonce: process.env.NONCE || '',
    };

    const t = Date.now();

    const headers = new Headers();
    headers.append('Authorization', config.token);
    headers.append('nonce', config.nonce);
    headers.append('t', t.toString());
    headers.append(
        'sign',
        crypto.HmacSHA256(config.token + t + config.nonce, config.secret).toString(crypto.enc.Base64),
    );

    const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
    };

    try {
        const deviceListData = await fetch(`${config.switchBotUri}/v1.1/devices`, requestOptions);

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
