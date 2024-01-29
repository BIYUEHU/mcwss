import Events from './utils/events';
import { MinecraftEvents } from './types/events';
interface McwssConfig {
    port: number;
    events?: Set<MinecraftEvents>;
    autoRegister?: boolean;
    autoClearEvents?: boolean;
}
export declare class Mcwss extends Events {
    private server?;
    private clients;
    private config;
    constructor(config: McwssConfig);
    private register;
    private handle;
    start(): void;
    stop(): void;
}
export default Mcwss;
