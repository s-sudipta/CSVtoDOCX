const tf = require('./table.js'); 
const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
// const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require('fs');
const docx = require('docx');
const { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,HeadingLevel,WidthType } = require('docx');
const saveAs = require('file-saver');
let mainWindow;

//create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    title:"CSV to DOCX",
    width: 1000,
    height: 600,
    webPreferences:{
      contextIsolation:true,
      nodeIntegration: true,
      preload: path.join(__dirname,'preload.js')
    }
  })
  mainWindow.loadURL(url.format({
    pathname : path.join(__dirname,'index.html'),
    protocol : 'file',
    slashes : true
  }));
  mainWindow.on("closed",()=>{
    mainWindow = null;
  });
}
//app is ready
app.whenReady().then(() => {
  createWindow();

  //implementing custom menu
  // const mainMenu = Menu.buildFromTemplate(menu);
  // Menu.setApplicationMenu(mainMenu);

    ipcMain.on('convert-json-to-docx', (event, jsonData, pathout) => {
      try{
    var arrayTableRow = [];
    arrayTableRow =  tf.tablefunc(jsonData,arrayTableRow);
    var headingforthetable = tf.headingfunc();
    arrayTableRow.unshift(headingforthetable);
    const table = new Table({
      columnWidths: [550, 1200, 1400 , 3000, 2200, 1200],   
      cellMargin: {
        top: 10,
        right: 10, 
        bottom: 10, 
        left: 10, 
      },
      rows: [ ...arrayTableRow],
  });
  
  var tableArray = [];
  tableArray = tf.tablearrayfunc(jsonData,tableArray);
  
  
  
  const doc = new Document({
      sections: [
          {
              children: [
                  new Paragraph({children: [new TextRun({text: 'VULNERABILITY SUMMARY',bold: true,}),],heading: HeadingLevel.HEADING_2,}),
                  new Paragraph({ text: "The Vulnerability findings have been summarized below along with their respective severity rating:" }),
                  table,
                  new Paragraph({children: [new TextRun({text: '\n\t\u2022 SECURITY FINDINGS AND ASSESSMENT DETAILS',highlight: '7DB0BD', bold: true,color: '000000'}),],heading: HeadingLevel.HEADING_1,}),
                  new Paragraph({children: [new TextRun({text: 'DETAILED LIST: FINDINGS & RECOMMENDATIONS',bold: true,}),],heading: HeadingLevel.HEADING_2,}),
                  new Paragraph({text: "This section presents the details of all the issues/findings which were identified during the assessment."}),
                  ...tableArray,
                  new Paragraph({text: ""})

              ],
          },
      ],
  });
  


    const outputFile = 'output.docx';
    const outputPath = pathout+`${outputFile}`;
    // Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log('Conversion done. File saved at:', outputPath,'\n');
      event.reply('conversion-done', outputPath);
    }).catch((error) => {
      console.error('Error:', error);
    });
  } catch (error) {
    console.error('Error:', error);
  }
  

//the window screen can't be duplicated
  app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length ===0){
      createWindow();
    }
  })
});
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});// close window for MacOS

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});// close window for MacOS

// //Menu template
// const menu = [
//   {
//     label: 'File',
//     submenu:[{
//       label: 'Exit',
//       click: () => app.quit(),
//       accelarator: 'CmdOrCtrl+W'
//     }
//     ]
//   }