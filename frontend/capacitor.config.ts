import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: false,
      showSpinner: true,
      backgroundColor: '#ffffff',
      spinnerColor: '#e2001a',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true
    }
  }
};

export default config;
