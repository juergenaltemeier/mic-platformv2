import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createDataStore } from './storage/DataStoreFactory'

// Instantiate the data store (SQLite or Postgres based on env)
const dataStore = createDataStore()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // Database IPC handlers
  ipcMain.handle('db:getById', async (_event, table: string, id: number) => {
    return dataStore.getById(table, id)
  })
  ipcMain.handle('db:getAll', async (_event, table: string) => {
    return dataStore.getAll(table)
  })
  ipcMain.handle('db:create', async (_event, table: string, item: any) => {
    return dataStore.create(table, item)
  })
  ipcMain.handle('db:update', async (_event, table: string, id: number, changes: any) => {
    return dataStore.update(table, id, changes)
  })
  ipcMain.handle('db:delete', async (_event, table: string, id: number) => {
    return dataStore.delete(table, id)
  })
  // IPC handler to select a directory via native dialog
  ipcMain.handle('dialog:selectDirectory', async (_event, defaultPath: string) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: defaultPath || undefined,
    })
    if (canceled || filePaths.length === 0) {
      return null
    }
    return filePaths[0]
  })

  // Initialize the data store (run migrations, etc.)
  await dataStore.init()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// Ensure the data store is closed before quitting
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('before-quit', async () => {
  await dataStore.close()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
