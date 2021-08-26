
import jsPDFInventoryTemplate, { OutputType } from "./ValorizedTemplate";

// Date Fns is used to format the dates we receive
// from our API call
import { parseISO, format } from 'date-fns';
import logo from '../../../assets/img/logo.jpg'; // Tell webpack this JS file uses this image


// define a generatePDF function that accepts a inventorys argument
const generateValorizedPrintPDF = (inventory, configData) => {
    
    // console.log("Inven:",inventory)
    const myDate = format(new Date(), 'dd/MM/yyyy')
    console.log("date:", myDate)

    var totalCost = 0;
    var totalPrice = 0;
    inventory.forEach(function (record) {
        totalCost += record.stock*record.cost;
        totalPrice += record.stock*record.price;
    });    
    

    const arrLines = Array.from(inventory, (item, index) => ([
        index + 1,
        item.code,
        item.name,      
        item.format,
        item.stock,
        item.cost,
        item.price

    ]))
    
    var props = {
        outputType: 'blob',
        returnJsPDFDocObject: true,
        fileName: `Inventory-report-valorized`,
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
            label: `Reporte Valorizado de Inventario al: ${myDate} `,            
            headerBorder: true,
            tableBodyBorder: true,
            header: ["#", "Codigo", "Producto", "Formato", "Existencia", "Costo", "Precio"],
            table: arrLines,
            invTotalLabel: "Total Movimientos:",
            invTotal: 0,
            InvTotalCost: parseFloat(totalCost),
            InvTotalPrice: parseFloat(totalPrice),
            invCurrency: "$",
            row1: {
                
            },
            row2: {
                
            },
            row3: {
                
            },
            invDescLabel: "Descripcion:",
            invDesc: inventory.description,
        },
        footer: {
            text: "",
        },
        pageEnable: true,
        pageLabel: "Page ",
    };
    const pdfCreated = jsPDFInventoryTemplate(props); //returns number of pages created
    var blob = pdfCreated.blob;

    var pdfObject = pdfCreated.jsPDFDocObject;


    window.open(URL.createObjectURL(pdfObject.output("blob")))

    // pdfCreated.jsPDFDocObject.output("blob"); //or .output('<outputTypeHere>');

};

export default generateValorizedPrintPDF;