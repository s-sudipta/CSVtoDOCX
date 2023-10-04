function jsonDataUpdate(jsonData) {
    var newjsonData = [];

    for(let data of jsonData){

        let IP = data.Host+'/'+data.Protocol+'/'+data.Port;
        let Vulnerability_Name = data.Name || "";
        Vulnerability_Name = Vulnerability_Name.replaceAll("\"","");
        Vulnerability_Name = Vulnerability_Name.replaceAll("\n"," "); 
        Vulnerability_Name = Vulnerability_Name.trim();
        Vulnerability_Name = Vulnerability_Name.replace(/\s+/g,' ');
        let words = Vulnerability_Name.split(" ");
        let name_id = words[words.length-1];
        if(/\d/.test(name_id)){
            Vulnerability_Name = Vulnerability_Name.substring(Vulnerability_Name.lastIndexOf(" "),-1);
        }else{
            name_id= "";
        }
        //console.log(Vulnerability_Name);
        //console.log(/\d/.test(name_id) + " "+ name_id);
        

        let Synopsis = data.Synopsis || "";
        Synopsis = Synopsis.replaceAll("\"","");
        Synopsis = Synopsis.replaceAll("\n"," "); 
        Synopsis = Synopsis.trim();
        Synopsis = Synopsis.replace(/\s+/g,' '); 

        let Description = data.Description || "";
        Description = Description.replaceAll("\"","");
        Description = Description.replaceAll("\n"," ");
        Description = Description.trim();
        Description = Description.replace(/\s+/g,' '); 

        let Solution = data.Solution || "";
        Solution = Solution.replaceAll("\"","");
        Solution = Solution.replaceAll("\n"," ");
        Solution = Solution.trim();
        Solution = Solution.replace(/\s+/g,' '); 
        
        let Risk = data.Risk;
        let CVE = (data.CVE != "") ? data.CVE : "";
        
        if(data.Host !== undefined){
            if(Risk == "High" || Risk== "Low" || Risk =="Medium" || Risk == "Critical"){
                let json_data = {
                "CVE": CVE,
                "Name_Id": name_id,
                "Risk": Risk,
                "Risk_Value":(Risk=="Critical")?1:((Risk == "High")?2:((Risk == "Medium")?3:4)),
                "IP": IP,
                "Name": Vulnerability_Name,
                "Business_Impact": Synopsis,
                "Description": Description,
                "Remidiation" : Solution
            };
            
            newjsonData.push(json_data);
            }
        }
    }
    let dataArray = Object.entries(newjsonData).map(([key, value]) => value);
    dataArray.sort((a, b) => {
        let A = a.CVE.toUpperCase();
        A = A.replace(/\s/g, '');
        let B = b.CVE.toUpperCase();
        B = B.replace(/\s/g, '');
        if (A > B) {
          return -1;
        }
        if (A < B) {
          return 1;
        }
        return 0;
    });
    dataArray.sort((a, b) => {
        let A = a.CVE.length;
        let B = b.CVE.length;
        if (A > B) {
          return -1;
        }
        if (A < B) {
          return 1;
        }
        return 0;
    });

    //..............................
    const subsetData = {};

    // Iterate over the array of objects
    const result = {};
    // Iterate over the data and group by the "Name" key
    dataArray.forEach(item => {
      const name = item.Name;
      if (!result[name]) {
        result[name] = [];
      }
      result[name].push(item);
    });
    
    // Convert the result to an array of JSON data
    const jsonArray = [];
    for (const arr in result) {
      jsonArray.push(result[arr]);
    }
    //......................................
    let optimalData = [];
    //top of each array contain optimal solution
    var Risk_Valuearr = []
    for(let index in jsonArray){
      if(jsonArray[index][0].CVE == ""){
        jsonArray[index] = sortbynameid(jsonArray[index]);
      }
      //check if high/low/medium present in the jsonArray
      let riskarr = []
      for(let risk_i in jsonArray[index]){
          riskarr.push(jsonArray[index][risk_i].Risk_Value);
      }
      riskarr.sort();
      Risk_Valuearr.push(Number(riskarr[0]));
      //................................
      optimalData.push(jsonArray[index][0])
    }
    //.......................................

    // assign the highest priority risk
    optimalData.map((item,index)=>{
      item.Risk_Value = Risk_Valuearr[index];
      let r = Risk_Valuearr[index];
      item.Risk = (r==1)?"Critical":((r==2)?"High":((r==3)?"Medium":"Low"));
    })
  
    //sorting data by risk (high,medium,low)
    optimalData = sortbyRisk(optimalData);
    //take all ip address of each data in array
    for(let i in jsonArray){
      let ipData="";
      for(let j in jsonArray[i]){
        if(j==0){
          ipData = jsonArray[i][j].IP;
        }
        else if(!(ipData.includes(jsonArray[i][j].IP))){
          ipData += " "+jsonArray[i][j].IP
        }
      }
      optimalData[i].IP = ipData;
    }
    optimalData = stringtoarrayIP(optimalData)
    
    return optimalData;
  }
//   module.exports = {
//     jsonDataUpdate: jsonDataUpdate
//   };

function sortbynameid(jsonArray){
  jsonArray.sort((a, b) => {
    let A = a.Name_Id.toUpperCase();
    A = A.replace(/\s/g, '');
    let B = b.Name_Id.toUpperCase();
    B = B.replace(/\s/g, '');
    if (A > B) {
      return -1;
    }
    if (A < B) {
      return 1;
    }
    return 0;
});
  return jsonArray;
}
function sortbyRisk(jsonArray){
  jsonArray.sort((a, b) => {
    let A = a.Risk_Value;
    let B = b.Risk_Value;
    if (A < B) {
      return -1;
    }
    if (A > B) {
      return 1;
    }
    return 0;
});
  return jsonArray;
}
function stringtoarrayIP(jsonData){
  jsonData.map(e =>{
    const Iparr = e.IP.split(" ");
    e.IP = Iparr;
  })  
  return jsonData;
}