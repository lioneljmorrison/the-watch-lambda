export interface Account {
    company: string;
    id: string;
    created: string;
}

export interface DeviceListStatus {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    enableCloudService: boolean;
    hubDeviceId: string;
}

export interface DeviceImport {
    deviceId: string;
    deviceName: string;
    deviceType: string;
}

export interface Device extends DeviceListStatus {
    deviceId: string;
    accountId: string;
    created: string;
}

export interface DeviceI extends DeviceImport {
    accountId: string;
    created: string;
}

export interface DeviceHookResponse {
    eventType: string;
    eventVersion: string;
    context: {
        deviceType: string;
        deviceMac: string;
        temperature: number;
        humidity: number;
        battery: number;
        scale: 'CELSIUS' | 'FAHRENHEIT';
        timeOfSample: number;
    };
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
    hubDeviceId?: string;
    humidity: number;
    temperature: number;
    version?: string;
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
