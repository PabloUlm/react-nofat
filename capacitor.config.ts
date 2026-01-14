import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.nofat.app',
    appName: 'NO FAT',
    webDir: 'dist',

    server: {
        // Para desarrollo con hot reload (solo en dev)
        // androidScheme: 'https'
    },

    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#4f46e5",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: false,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            splashFullScreen: true,
            splashImmersive: true,
        },

        LocalNotifications: {
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#4f46e5",
            sound: "beep.wav",
        },

        StatusBar: {
            style: 'dark',
            backgroundColor: '#4f46e5',
        },
    },
};

export default config;