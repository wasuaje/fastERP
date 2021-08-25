
import jsPDFInvoiceTemplate, { OutputType } from "./InvoiceTemplate";

// Date Fns is used to format the dates we receive
// from our API call
import { parseISO, format } from 'date-fns';
import logo from '../../assets/img/logo.jpg'; // Tell webpack this JS file uses this image



// define a generatePDF function that accepts a invoices argument
const generateInvoicePrintPDF = (invoice, configData) => {    
    

    const totalDct = invoice.subtotal * (invoice.dct / 100)
    const totalTax = (invoice.subtotal - totalDct) * (invoice.tax / 100)
    const arrProducts = Array.from(invoice.invoice_detail, (item, index) => ([
        index + 1,
        item.product.name,
        item.price,
        item.qtty,
        item.product.format,
        item.total
    ]))

    var props = {
        outputType: 'blob',
        returnJsPDFDocObject: true,
        fileName: `Invoice-${invoice.invoice}`,
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
        contact: {
            label: "factura a nombre de:",
            name: invoice.client.name,
            address: `${invoice.client.address}-${invoice.client.city}-${invoice.client.zip_code}`,
            phone: invoice.client.phone,
            email: invoice.client.email,
            otherInfo: invoice.client.website,
        },
        invoice: {
            label: "Factura Nro: ",
            num: invoice.invoice,
            invDate: `F. Vencimiento: ${format(parseISO(invoice.due_date), 'dd/MM/yyyy')}` ,
            invGenDate: `Fecha Factura: ${format(parseISO(invoice.date), 'dd/MM/yyyy')}` ,
            headerBorder: true,
            tableBodyBorder: true,
            header: ["#", "Descripcion", "Precio", "Cant.", "Unidad", "Total"],
            table: arrProducts,
            invTotalLabel: "Total:",
            invTotal: invoice.total.toFixed(2),
            invCurrency: "$",
            row2: {
                col1: `IVA: (${invoice.dct}%)`,
                col2: totalTax.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            row3: {
                col1: `DCTO: (${invoice.tax}%)`,
                col2: totalDct.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            row1: {
                col1: 'SubTotal:',
                col2: invoice.subtotal.toFixed(2),
                col3: '$',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            invDescLabel: "Nota:",
            invDesc: invoice.body_note,
        },
        footer: {
            text: invoice.foot_note,
        },
        pageEnable: true,
        pageLabel: "Page ",
    };
    const pdfCreated = jsPDFInvoiceTemplate(props); //returns number of pages created
    var blob = pdfCreated.blob;

    console.log(pdfCreated)
    console.log(invoice)
    var pdfObject = pdfCreated.jsPDFDocObject;


    window.open(URL.createObjectURL(pdfObject.output("blob")))

    // pdfCreated.jsPDFDocObject.output("blob"); //or .output('<outputTypeHere>');

};

export default generateInvoicePrintPDF;