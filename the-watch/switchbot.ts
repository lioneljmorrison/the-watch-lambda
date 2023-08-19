import * as crypto from 'crypto-js';
import { OpenAPIConfig } from './interfaces';

export class SwitchbotAuth {
    config: OpenAPIConfig;
    timestamp = Date.now();

    constructor(config: OpenAPIConfig) {
        this.config = config;
    }

    set t(timestamp: number) {
        this.timestamp = timestamp;
    }

    set token(token: string) {
        this.config.token = token;
    }

    set nonce(nonce: string) {
        this.config.nonce = nonce;
    }

    get sign(): string {
        return crypto
            .HmacSHA256(this.config.token + this.timestamp + this.config.nonce, this.config.secret)
            .toString(crypto.enc.Base64);
    }

    get fetchHeaderDeviceList(): HeadersInit {
        return {
            Authorization: this.config.token,
            nonce: this.config.nonce,
            t: this.timestamp.toString(),
            sign: this.sign,
        };
    }
}
