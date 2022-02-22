import { ipcMain } from 'electron';

import ArchiveService from '../services/archive.service';

export default function registerIpcChannels() {
  ipcMain.on('archive/getBadTweets', (event) => {
    return ArchiveService.getBadTweets(event);
  });

  ipcMain.on('archive/analyze', (event, archivePath) => {
    return ArchiveService.analyze(event, archivePath);
  });
}
