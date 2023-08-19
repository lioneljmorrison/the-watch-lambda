export interface DeviceListStatus {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    enableCloudService: boolean;
    hubDeviceId: string;
}

export interface Device extends DeviceListStatus {
    deviceId: string;
    accountId: string;
    created: string;
}

export interface DeviceList {
    statusCode: number;
    body: {
        deviceList: DeviceListStatus[];
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

export interface LogDeviceStatus extends DeviceStatus {
    created: string;
    accountId: string;
}

export interface OpenAPIConfig {
    secret: string;
    token: string;
    nonce: string;
}

export interface deviceStatusParameters {
    device: string;
}
