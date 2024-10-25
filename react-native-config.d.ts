declare module 'react-native-config' {
    export interface NativeConfig {
        HOSTNAME?: string;
        ENV?: string;
    }

    export const Config: NativeConfig
    export default Config
}