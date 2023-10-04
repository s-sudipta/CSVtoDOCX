const { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,WidthType,BorderStyle,VerticalMergeType, ShadingType} = require('docx');

function tablefunc(jsonData,arrayTableRow){
    jsonData.map((item,index)=>{
      let textRunIp =[]
      item.IP.map((ip,index)=>{
        const textRunIpvalue = new TextRun({text: ip,
        break: index==0?0:1,});
        textRunIp.push(textRunIpvalue);
      });
        const tableRow = new TableRow({
          children:[
            new TableCell({
              children: [new Paragraph((index+1)+"")],
              
          }),
            new TableCell({
             
              children: [new Paragraph(item.Name+item.Name_Id)],
          }),
          new TableCell({
         
            children: [new Paragraph(item.CVE)],
          }),
          new TableCell({   
            children: [new Paragraph(item.Remidiation)],
        }),
          new TableCell({
              children: [new Paragraph({children:[...textRunIp]})],
          }),
          new TableCell({
            children: [new Paragraph(item.Risk)],
            shading: {
                fill: (item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), 
                val: ShadingType.CLEAR, 
              },
        }),//o: fc8403 y : fcf403 r : fc0303
          ]
        });
        arrayTableRow.push(tableRow);
      });
      return arrayTableRow;
}
function headingfunc(){
    const tableRow = new TableRow({
        children:[
          new TableCell({
            children: [new Paragraph("SI_No.")],
            shading: {
                fill: "9FC5E8", 
                val: ShadingType.CLEAR, 
              },
        }),
          new TableCell({
           
            children: [new Paragraph("Finding")],
            shading: {
                fill: "9FC5E8", 
                val: ShadingType.CLEAR, 
              },
        }),
        new TableCell({
       
          children: [new Paragraph("CVE/CWE No.")],
          shading: {
            fill: '9FC5E8', 
            val: ShadingType.CLEAR, 
          },
        }),
        new TableCell({   
          children: [new Paragraph("Remediation")],
          shading: {
            fill: '9FC5E8', 
            val: ShadingType.CLEAR, 
          },
      }),
        new TableCell({
            children: [new Paragraph("Vulnerable Points")],
            shading: {
                fill: "9FC5E8", 
                val: ShadingType.CLEAR, 
              },
            
        }),
        new TableCell({
          children: [new Paragraph("Severity")],
          shading: {
            fill: "9FC5E8", 
            val: ShadingType.CLEAR, 
          },
      }),
        ]
      });
    return tableRow;//Sl. No.	Finding	CVE/CWE No.	Remediation	Vulnerable Points	Severity
}

function tablearrayfunc(jsonData,tableArray){
  var cellSpacing = 150;
    jsonData.map((item,index)=>{
      const rowCells = new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "" })] })],
          shading: {
            fill: (item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), 
            val: ShadingType.CLEAR,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, color:(item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), }, 
            bottom: { style: BorderStyle.SINGLE, color:(item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), },
            left: { style: BorderStyle.SINGLE, color:(item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), },
            right: { style: BorderStyle.SINGLE, color:(item.Risk == "High"||item.Risk == "Critical")?'CC0000':((item.Risk == "Medium")?"F1C232":"FCF403"), },
          },
        });
        
      let textRunIp =[]
      item.IP.map((ip,index)=>{
        const textRunIpvalue = new TextRun({text: ip,
        break: index==0?0:1,});
        textRunIp.push(textRunIpvalue);
      });
    const table2 = new Table({
      columnWidths: [6000,2000,450],   
      rows: [new TableRow({
              children: [
                new TableCell({
                          children: [new Paragraph({
                          children: [new TextRun({ text: "Vulnerability name:",bold:true,}),new TextRun({ text: item.Name, break:1,}),]
                        })],  margins: {
                          top: cellSpacing,
                          bottom: cellSpacing,
                          left: cellSpacing,
                          right: cellSpacing,
                        },
                    }),
                    new TableCell({
                         
                      children: [new Paragraph({
                        children: [new TextRun({ text: "Risk:",bold:true,}),new TextRun({ text: (item.Risk=="Critical")?"High":item.Risk, break:1,}),]
                      })],  margins: {
                        top: cellSpacing,
                        bottom: cellSpacing,
                        left: cellSpacing,
                        right: cellSpacing,
                      },
                  }),
                  
                  rowCells
                  ],
            }),
          new TableRow({
            children:[
              new TableCell({
                         
                children: [new Paragraph({
                  children: [new TextRun({ text: "Business Impact:",bold:true,}),new TextRun({ text: item.Business_Impact, break:1,}),]
                }),
                
              ],columnSpan: 2,
              margins: {
                top: cellSpacing,
                bottom: cellSpacing,
                left: cellSpacing,
                right: cellSpacing,
              },
            }),rowCells
          ],
          }),
          new TableRow({
            children:[
              new TableCell({
                         
                children: [new Paragraph({
                  children: [new TextRun({ text: "Description:",bold:true,}),new TextRun({ text: item.Description, break:1,}),]
                }),
                
              ],columnSpan: 2,
              margins: {
                top: cellSpacing,
                bottom: cellSpacing,
                left: cellSpacing,
                right: cellSpacing,
              },
            }),rowCells
          ],
          }),
          new TableRow({
            children:[
              new TableCell({
                         
                children: [new Paragraph({
                  children: [new TextRun({ text: "Proof of Concept:",bold:true,}),]
                }),
                
              ],columnSpan: 2,
              margins: {
                top: cellSpacing,
                bottom: cellSpacing,
                left: cellSpacing,
                right: cellSpacing,
              },
            }),rowCells
          ],
          }),
          new TableRow({
            children:[
              new TableCell({
                         
                children: [new Paragraph({
                  children: [new TextRun({ text: "Vulnerable Ips:",bold:true,})]
                }),
                ,new Paragraph({children:[...textRunIp]}),
              ],columnSpan: 2,
              margins: {
                top: cellSpacing,
                bottom: cellSpacing,
                left: cellSpacing,
                right: cellSpacing,
              },
            }),rowCells
          ],
          }),
          new TableRow({
            children:[
              new TableCell({
                         
                children: [new Paragraph({
                  children: [new TextRun({ text: "Remidiation:",bold:true,}),new TextRun({ text: item.Remidiation, break:1,}),]
                }),
                
              ],columnSpan: 2,
              margins: {
                top: cellSpacing,
                bottom: cellSpacing,
                left: cellSpacing,
                right: cellSpacing,
              },
            }),rowCells
          ],
          }), 
          ],
        });
        const extrapara = new Paragraph({children:[new TextRun({text:""})]})
        tableArray.push(table2);
        tableArray.push(extrapara);
    });

    return tableArray;
}
module.exports = {
        tablearrayfunc:tablearrayfunc,
        tablefunc: tablefunc,
        headingfunc: headingfunc,
};

