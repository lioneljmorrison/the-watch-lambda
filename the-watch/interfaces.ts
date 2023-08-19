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

export interface DeviceStatus {
    deviceId: string;
    deviceType: string;
    hubDeviceId: string;
    humidity: number;
    temperature: number;
    version: string;
    battery: number;
}

export interface OpenAPIConfig {
    secret: string;
    token: string;
    nonce: string;
}

export interface deviceStatusParameters {
    device: string;
}
