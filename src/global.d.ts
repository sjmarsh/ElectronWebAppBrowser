export {};

declare global {
    interface Window {
        api: IContextBridgeApi;
    }
}