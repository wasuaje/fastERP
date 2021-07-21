import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a invoices argument
const generateInvoiceReportPDF = invoices => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["Product", "Qtty", "Price", "Total"];
  // define an empty array of rows
  const tableRows = [];
  let invoiceTotal = 0.0;
  // for each invoice pass all its data into an array
  invoices.invoice_detail.forEach(invoice => {
    const invoiceData = [
      invoice.product.name,
      invoice.qtty,
      invoice.price,
      invoice.total,
      // called date-fns to format the date on the invoice
    //   format(new Date(invoice.updated_at), "yyyy-MM-dd")
    ];
    invoiceTotal+=invoice.total
    // push each tickcet's info into a row
    tableRows.push(invoiceData);
  });

  const foot = [
      [{'content': `Total: ${invoiceTotal}`, colSpan: 3, rowSpan: 2, styles: { halign: 'right' }}]
  ]
  

  // startY is basically margin-top
//   doc.autoTable(tableColumn, tableRows, { startY: 20, foot: foot});
  doc.autoTable({
      body: tableRows,
      columns: tableColumn,
      foot: foot,
      startY: 20,      
  })
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // invoice title. and margin-top + margin-left
  doc.text("Closed invoices within the last one month.", 14, 15);
  // we define the name of our PDF file.
//   doc.save(`report_${dateStr}.pdf`);
  window.open(URL.createObjectURL(doc.output("blob")))


};

export default generateInvoiceReportPDF;