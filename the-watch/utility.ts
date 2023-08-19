import { SwitchbotAuth } from './switchbot';

export const switchbot = new SwitchbotAuth({
    secret: process.env.SECRET || '',
    token: process.env.TOKEN || '',
    nonce: process.env.NONCE || '',
});
