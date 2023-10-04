//event listerner for browse file from system
document.querySelector('#choosefile').addEventListener('click', function() {
    document.querySelector('#fileSelect').click();
});
//event listener for file path
document.querySelector('#fileSelect').addEventListener('change', function() {
  const filePath = document.querySelector('#filePath');
  if (document.getElementById('fileSelect').files && document.getElementById('fileSelect').files[0]) {
    filePath.textContent = this.files[0].path;
  } else {
    filePath.textContent = '';
  }
});
// event listener for submit button (CSV to Docx)
document.querySelector('#convertBtn').addEventListener('click', () => {
    var files = document.getElementById('fileSelect').files;
    if(files.length==0){
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.CSV') {
        csvFileToJSON(files[0]);
    }else{
        alert("Please select a valid csv file.");
    }
});

// function to convert csv to json
function csvFileToJSON(file){
  try {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
        var jsonData = [];
        var headers = [];
        var rows = e.target.result.split("\r\n");               
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(",");
            var rowData = {};
            for(var j=0;j<cells.length;j++){
                if(i==0){
                    var headerName = cells[j].trim();
                    headers.push(headerName);
                }else{
                    var key = headers[j];
                    if(key){
                        rowData[key] = cells[j].trim();
                    }
                }
            }
            //skip the first row (header) data
            if(i!=0){
                jsonData.push(rowData);
            }
        }
        //displaying the json result in string format JSON.stringify
        var newjsonData = []
        newjsonData = jsonDataUpdate(jsonData);
        JsontoDocx(newjsonData);
        }
    }catch(e){
        console.log(e);
    }
}
// convert json to docx template
function JsontoDocx(jsonData){
  var pathofOutput = document.getElementById('fileSelect').files[0].path.substring(0, document.getElementById('fileSelect').files[0].path.lastIndexOf('.'));
  ipcRenderer.send('convert-json-to-docx', jsonData, pathofOutput);
}

ipcRenderer.on('conversion-done', (event, outputPath) => {
  document.getElementById('outputPath').innerHTML = outputPath;
  document.getElementById('outputPath').href = outputPath;
  document.getElementById('outputLink').style.display = "block";
});
ipcRenderer.on('conversion-error', (event,error) => {
    document.getElementById('outputPath').innerHTML = error.message;
    document.getElementById('outputPath').href = "";
    document.getElementById('outputLink').style.display = "block";
  });
// formatting json file
