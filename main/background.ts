import 'reflect-metadata';
import { app, nativeTheme } from 'electron';
import serve from 'electron-serve';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import { createWindow, registerIpcChannels } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  if (!isProd) {
    const installedExtension = await installExtension(REACT_DEVELOPER_TOOLS);
    console.info(`Added extension "${installedExtension}"`);
  }

  const mainWindow = createWindow('main', {
    width: 500,
    height: 720,
  });

  mainWindow.setMenuBarVisibility(false);
  nativeTheme.themeSource = 'dark';

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

registerIpcChannels();
