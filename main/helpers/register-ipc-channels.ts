import { ipcMain } from 'electron';

import ArchiveService from '../services/archive.service';

export default function registerIpcChannels() {
  ipcMain.handle('archive/getBadTweets', async () => {
    return ArchiveService.getBadTweets();
  });

  ipcMain.handle('archive/analyze', async (_, archivePath) => {
    return ArchiveService.analyze(archivePath);
  });
}
