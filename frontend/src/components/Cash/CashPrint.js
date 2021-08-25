
import jsPDFCashTemplate, { OutputType } from "./CashTemplate";

// Date Fns is used to format the dates we receive
// from our API call
import { parseISO, format } from 'date-fns';
import logo from '../../assets/img/logo.jpg'; // Tell webpack this JS file uses this image


// define a generatePDF function that accepts a cashs argument
const generateCashPrintPDF = (cash, configData) => {
    
    var totalEnt = 0;
    var totalSal = 0;
    cash.cash_detail.forEach(function (record) {
        if (record.amount > 0) totalEnt += record.amount;
        if (record.amount < 0) totalSal += record.amount;
    });    
    

    const arrLines = Array.from(cash.cash_detail, (item, index) => ([
        index + 1,
        item.concept,
        item.amount        
    ]))
    
    var props = {
        outputType: 'blob',
        returnJsPDFDocObject: true,
        fileName: `Cash-${cash.cash}`,
        orientationLandscape: false,
        logo: {
            src: logo,
            width: 30.33, //aspect ratio = width/height
            height: 26.66,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },        
        business: {
            name: configData.company_name,
            address: `${configData.company_address1} - ${configData.company_address2}`,
            phone: configData.company_phone,
            email: configData.company_email,
            email_1: configData.company_email1,
            website: configData.company_web_url,
        },
        invoice: {
            label: `Reporte de Caja al: ${format(parseISO(cash.date), 'dd/MM/yyyy')} `,            
            headerBorder: true,
            tableBodyBorder: true,
            header: ["#", "Concepto", "Monto"],
            table: arrLines,
            invTotalLabel: "Total:",
            invTotal: (cash.amount_open+totalEnt+totalSal).toFixed(2),
            invCurrency: "$",
            row1: {
                col1: `Monto Apertura`,
                col2: cash.amount_open.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            row2: {
                col1: `Total Salidas`,
                col2: totalSal.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            row3: {
                col1: 'Total Entradas:',
                col2: totalEnt.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            invDescLabel: "Descripcion:",
            invDesc: cash.description,
        },
        footer: {
            text: "",
        },
        pageEnable: true,
        pageLabel: "Page ",
    };
    const pdfCreated = jsPDFCashTemplate(props); //returns number of pages created
    var blob = pdfCreated.blob;

    console.log(pdfCreated)
    console.log(cash)
    var pdfObject = pdfCreated.jsPDFDocObject;


    window.open(URL.createObjectURL(pdfObject.output("blob")))

    // pdfCreated.jsPDFDocObject.output("blob"); //or .output('<outputTypeHere>');

};

export default generateCashPrintPDF;