
import jsPDFInventoryTemplate, { OutputType } from "./InventoryTemplate";

// Date Fns is used to format the dates we receive
// from our API call
import { parseISO, format } from 'date-fns';
import logo from '../../assets/img/logo.jpg'; // Tell webpack this JS file uses this image


// define a generatePDF function that accepts a inventorys argument
const generateInventoryPrintPDF = (inventory, configData) => {
    
    var totalEnt = 0;
    var totalSal = 0;
    inventory.inventory_detail.forEach(function (record) {
        if (record.qtty > 0) totalEnt += record.qtty;
        if (record.qtty < 0) totalSal += record.qtty;
    });    
    

    const arrLines = Array.from(inventory.inventory_detail, (item, index) => ([
        index + 1,
        item.qtty,
        item.product.name        
    ]))
    
    var props = {
        outputType: 'blob',
        returnJsPDFDocObject: true,
        fileName: `Inventory-${inventory.inventory}`,
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
            label: `Movimiento de inventario: ${format(parseISO(inventory.date), 'dd/MM/yyyy')} `,            
            headerBorder: true,
            tableBodyBorder: true,
            header: ["#", "Producto", "Cantidad"],
            table: arrLines,
            invTotalLabel: "Total Movimientos:",
            invTotal: (totalEnt+totalSal).toFixed(2),
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

export default generateInventoryPrintPDF;