const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow(
        { show: false }
    );

    win.maximize()
    win.show()

    win.loadURL(`file://${__dirname}/dist/gui/index.html`);

    // for debugging purposes
    //win.webContents.openDevTools();

    win.on('closed', function () {
        win = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // on macos specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



