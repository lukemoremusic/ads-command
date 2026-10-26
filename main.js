const {app,BrowserWindow,ipcMain,shell}=require('electron');
const path=require('path');
const {autoUpdater}=require('electron-updater');
let win; let update={state:'idle',detail:'Noch nicht geprüft'};
app.setName('ADS COMMAND');
function report(state,detail){update={state,detail};win?.webContents.send('update-status',update)}
function create(){win=new BrowserWindow({width:1320,height:850,minWidth:900,minHeight:630,title:'ADS COMMAND',backgroundColor:'#0e1421',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});win.loadFile('index.html');win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\/(open\.spotify\.com|github\.com)\//.test(url))shell.openExternal(url);return {action:'deny'}});win.webContents.on('will-navigate',(e,url)=>{if(url!==win.webContents.getURL())e.preventDefault()});}
autoUpdater.autoDownload=false;
autoUpdater.on('update-available',i=>report('available','Version '+i.version+' verfügbar'));
autoUpdater.on('update-not-available',()=>report('current','Aktuellste Version'));
autoUpdater.on('download-progress',p=>report('downloading',Math.round(p.percent)+' %'));
autoUpdater.on('update-downloaded',()=>report('ready','Update bereit zur Installation'));
autoUpdater.on('error',e=>report('error',e.message));
ipcMain.handle('update-info',()=>({...update,version:app.getVersion(),packaged:app.isPackaged}));
ipcMain.handle('update-check',async()=>{if(!app.isPackaged)return report('unavailable','Updatefunktion erst in installierter App')||update;try{await autoUpdater.checkForUpdates()}catch(e){report('error',e.message)}return update});
ipcMain.handle('update-download',async()=>{try{await autoUpdater.downloadUpdate()}catch(e){report('error',e.message)}return update});
ipcMain.handle('update-install',()=>{if(update.state==='ready')setImmediate(()=>autoUpdater.quitAndInstall())});
app.whenReady().then(()=>{create();if(app.isPackaged)setTimeout(()=>autoUpdater.checkForUpdates().catch(()=>{}),15000)});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create()});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});