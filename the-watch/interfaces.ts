export interface DeviceList {
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

export interface OpenAPIConfig {
    secret: string;
    token: string;
    nonce: string;
}
