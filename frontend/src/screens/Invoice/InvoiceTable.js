import React, { useEffect, useState, useRef } from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import InvoiceForm from './InvoiceForm';
import Button from '@material-ui/core/Button';
import GenericDialogBox from '../../components/GenericDialogBox';
import PrintDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import PatchedPagination from '../../components/PatchedPagination'
import { useTranslation } from "react-i18next";
import { parseISO, format } from 'date-fns';
import InvoiceExample from '../../components/Invoice/InvoiceExample';
import InvoiceReport from '../../components/Invoice/InvoiceReport';
import InvoicePrint from '../../components/Invoice/InvoicePrint';

const classes = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.graphy.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  fab: {
    bottom: '50px',
    position: 'fixed',
    marginTop: '10px'
  }
});


const InvoiceModal = React.forwardRef((props, ref) => {
  const { handleFormCLose, showForm, idToUpdate } = props;

  return (
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">
      <InvoiceForm idToUpdate={idToUpdate} />      
    </Modal>
  )
})


const DialogBoxScreen = (props) => {
  const { printDialogOpen, handlePrintDialogClose, idToUpdate } = props;
  const componentRef = useRef();

  return (
    <Modal
      open={printDialogOpen}
      onClose={handlePrintDialogClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">
      <div>
        {/* <ReactToPrint
          trigger={() =>  <button>Print this out!</button>}
          content={() => componentRef.current}
        /> */}
        <InvoiceExample ref={componentRef} printDialogOpen={printDialogOpen} />
        <button onClick={() => window.print()}>Print this out!</button>
      </div>      
    </Modal>
  )
};

const baseURL = process.env.REACT_APP_PUBLIC_API_URL
const base_url = 'api'
const endpoint = `${base_url}/invoice/`
const endpointPaginated = `${baseURL}/api/invoice/`

const InvoiceTable = (props) => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  useEffect(() => {

    retrieveData()
  }, []); // Those ARE connectec


  const retrieveData = () => {
    DataService.getAll(endpoint)
      .then(response => {
        var tempData = response.data.items;
        // tempData.forEach(function (record) {
        //   // var sumEach = 0.00
        //   record.invoice_detail.forEach((detail) => {
        //     record.total += detail.total
        //   })
        //   // tempData.total = sumEach; 
        // });
        setData(tempData)
        // console.log(tempData);
      })
      .catch(e => {
        // console.log(e);
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
      });
  }

  const deleteData = (id) => {
    var dataDelete = { 'id': id };
    DataService.delete(endpoint, dataDelete)
      .then(response => {
        openNoticeBox("Notice", "Invoice deleted successfully")
        retrieveData()
      })
      .catch(e => {
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
      });
  }


  // INFO NOTIFICATION VARS
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoBody, setInfoBody] = useState('');
  //***********************

  // DELETE DIALOG VARS
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogueTitle, setDialogueTitle] = useState('');
  const [dialogueBody, setDialogueBody] = useState('');
  const [idToDelete, setidToDelete] = useState(null);
  // ************

  // PRINT DIALOG VARS
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printDialogueTitle, setPrintDialogueTitle] = useState('');
  const [printDialogueBody, setPrintDialogueBody] = useState('');
  const [invoiceObj, setInvoiceObj] = useState({});
  // ************

  // FORM VARS
  const [idToUpdate, setidToUpdate] = useState(null);
  useEffect(() => {
    let isActive = true;
    return () => { isActive = false };
  }, [idToUpdate]);
  const [showForm, setShowForm] = useState(false);

  // FORM FUNCTIONS
  const handleFormCLose = () => {
    retrieveData()
    setShowForm(false);
  };

  const handleFormOpen = (id) => {
    // console.log("id",typeof id)
    let newId = typeof id === 'object' ? 0 : id
    setidToUpdate(newId)
    setShowForm(true);
  };
  // ********************

  // Notification INFO functions
  const openNoticeBox = (title, body) => {
    setInfoTitle(title)
    setInfoBody(body)
    setInfoOpen(true)
  };

  const handleInfoClose = () => {
    retrieveData()
    setInfoOpen(false)
  };
  // *****************

  // DELETE DIALOG FUNCTIONS 
  const handleDialogOk = () => {
    deleteData(idToDelete)
    setDialogOpen(false)
  };

  const handleDialogClose = () => {
    retrieveData()
    setidToDelete(null)
    setDialogOpen(false)

  };

  const openDialogBox = (id) => {
    setDialogueTitle(t("delete_record_question"))
    setDialogueBody(t("sure_to_delete_record_question")+id)
    // console.log(dialogOpen, dialogueTitle, dialogueBody)
    setidToDelete(id)
    setDialogOpen(true)
  };



  //**********************
  // PRINT DIALOG FUNCTIONS 

  const handlePrintDialogOk = () => {
    // deleteData(idToDelete)        
    setPrintDialogOpen(false)
  };

  const handlePrintDialogClose = () => {
    // retrieveData()
    // setidToDelete(null)                            
    setPrintDialogOpen(false)

  };

  const openPrintBox = (invoiceObj) => {
    setPrintDialogueTitle("Print?")
    setPrintDialogueBody("Are you sure to print Invoice Id: " + invoiceObj.id)
    // console.log(dialogOpen, dialogueTitle, dialogueBody)
    // setidToDelete(id) 
    setPrintDialogOpen(true)
  };

  // *******************


  const tableRef = React.createRef();

  return (
    <div >
      <GenericDialogBox
        opn={dialogOpen}
        handleDialogOk={handleDialogOk}
        handleDialogClose={handleDialogClose}
        title={dialogueTitle}
        body={dialogueBody} />
      <InfoBox
        opn={infoOpen}
        handleDialogClose={handleInfoClose}
        title={infoTitle}
        body={infoBody} />

      <InvoiceModal handleFormCLose={handleFormCLose} showForm={showForm} idToUpdate={idToUpdate} />
      <DialogBoxScreen printDialogOpen={printDialogOpen} handlePrintDialogClose={handlePrintDialogClose} />

      <MaterialTable
        title={t("invoice_table_title")}
        tableRef={tableRef}
        columns={[
          { title: 'ID', field: 'id' },
          { title: 'Date', field: 'date' , render: rowData => format(parseISO(rowData.date), 'dd/MM/yyyy') },
          { title: 'Invoice', field: 'invoice' },
          { title: 'Due Date', field: 'due_date' , render: rowData => format(parseISO(rowData.due_date), 'dd/MM/yyyy') },
          { title: 'Client', field: 'client.name' },
          { title: 'SubTotal', field: 'subtotal', render: rowData => rowData.subtotal.toFixed(2) },
          { title: 'Dct %', field: 'dct' , render: rowData => rowData.dct.toFixed(2)},
          { title: 'Tax %', field: 'tax' , render: rowData => rowData.tax.toFixed(2)},
          { title: 'Total', field: 'total' , render: rowData => rowData.total.toFixed(2)},
          { title: 'Collected', field: 'collected' , render: rowData => rowData.collected ? 'Yes' : 'No'}
        ]}
        // data={[
        //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
        // ]}   
        data={data}
        actions={[
          {
            icon: 'edit',
            tooltip: t("detail_edit_record_tip"),
            onClick: (event, rowData) => handleFormOpen(rowData.id)
          },
          {
            icon: 'delete',
            tooltip: t("detail_delete_record_tip"),
            onClick: (event, rowData) => openDialogBox(rowData.id)
          },
          {
            icon: 'print',
            tooltip: t("detail_print_record_tip"),
            onClick: (event, rowData) => InvoicePrint(rowData)
            // onClick: (event, rowData) => InvoiceReport(rowData)
          }
          //add collect button
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          // paging: false
        }}
        components={{
          Pagination: PatchedPagination,
        }}
      />

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleFormOpen} style={{ marginTop: '10px' }}  >
        <AddIcon />
      </Fab>
    </div>
  )
}

export default InvoiceTable;