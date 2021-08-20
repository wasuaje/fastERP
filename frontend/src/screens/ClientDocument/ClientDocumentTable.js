import React, { useEffect, useState, useRef } from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import ClientDocumentForm from './ClientDocumentForm';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import PatchedPagination from '../../components/PatchedPagination'
import { useTranslation } from "react-i18next";
import { parseISO, format } from 'date-fns';
import SettingsIcon from '@material-ui/icons/Settings';
import OrderPrint from '../../components/Invoice/OrderPrint';

const useStyles = makeStyles((theme)  => ({
  paper: {    
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.fontSize,
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

    position: 'fixed',
    marginTop: '10px'
  }
}));


const InvoiceModal = React.forwardRef((props, ref) => {
  const { handleFormCLose, showForm, idToUpdate } = props;

  return (
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{ marginTop: '-100px', marginLeft: '70px' }}
      >      
      <ClientDocumentForm idToUpdate={idToUpdate} />      
    </Modal>
  )
})


const baseURL = process.env.REACT_APP_PUBLIC_API_URL
const base_url = 'api'
const endpoint = `${base_url}/client-document/`
const processEndpoint = `${base_url}/client-document/invoice/`
const configEndpoint = `${base_url}/configuration`

const InvoiceTable = (props) => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  useEffect(() => {

    retrieveData()
  }, []); // Those ARE connectec


  const retrieveData = () => {
    DataService.getAll(endpoint)
      .then(response => {        
        setData(response.data)        
      })
      .catch(e => {        
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}  - ${e.response.data.detail}`)
      });
  }

  const deleteData = (id) => {
    var dataDelete = { 'id': id };
    DataService.delete(endpoint, dataDelete)
      .then(response => {        
        openNoticeBox("Notice",t("record_deleted_success"))   
        retrieveData()
      })
      .catch(e => {
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
      });
  }


  const [configData, setConfigData] = useState({});
	useEffect(() => {

		retrieveConfigData()
	}, []); 

	const retrieveConfigData = () => {
		DataService.getAll(configEndpoint)
			.then(response => {
        let configTemp = {};
        response.data.forEach(cfg => {
          configTemp[cfg.config_name] = cfg.config_value          
        });

				setConfigData(configTemp)
				// console.log(configTemp);      
			})
			.catch(e => {
        console.log(e)
				alert(`Error - Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}


  const InvoiceDocument = (id) => {
    var dataProcess = { 'id': id };
    DataService.create(processEndpoint, dataProcess)
      .then(response => {        
        openNoticeBox("Notice",t("record_processed_success"))   
        retrieveData()
      })
      .catch(e => {
        console.log(e.response)
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
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
  const [idToPrint, setidToPrint] = useState(null);
  // ************

  // Process DIALOG VARS
  const [idToProcess, setidToProcess] = useState(null);
  const [dialogAction, setDialogAction] = useState('nothing');
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
    console.log("id",typeof id)
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
    // console.log("DialogAct: ",dialogAction)
    if (dialogAction == 'delete') deleteData(idToDelete)
    if (dialogAction == 'invoice') InvoiceDocument(idToProcess)
    setDialogOpen(false)
  };

  const handleDialogClose = () => {
    retrieveData()
    setidToDelete(null)
    setDialogOpen(false)

  };

  const openDialogBox = (id, action) => {
    setDialogAction(action)
    if (action === 'delete'){      
      setDialogueTitle(t("delete_record_question"))
      setDialogueBody(t("sure_to_delete_record_question")+ ' ' +id)
      // console.log(dialogOpen, dialogueTitle, dialogueBody)
      setidToDelete(id)
    }
  
    if (action === 'invoice'){
      setDialogueTitle(t("invoice_record_question"))
      setDialogueBody(t("sure_to_invoice_record_question")+ ' '+id)
      // console.log(dialogOpen, dialogueTitle, dialogueBody)
      setidToProcess(id)
    }
    setDialogOpen(true)
  };

  
	const classes = useStyles();

  const tableRef = React.createRef();

  return (    
      <Grid container spacing={2} >
      <Grid item xs={12}>
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

      <MaterialTable
        title={t("client_document_table_title")}
        tableRef={tableRef}
        columns={[
          { title: 'ID', field: 'id' },
          { title: t("form_table_column_date"), field: 'date' , render: rowData => format(parseISO(rowData.date), 'dd/MM/yyyy') },
          { title: t("form_table_column_document_type"), field: 'document_type.code' },          
          { title: t("form_table_column_document"), field: 'document' },          
          { title: t("form_table_column_client"), field: 'client.name' },
          { title: t("form_table_column_subtotal"), field: 'subtotal', render: rowData => rowData.subtotal.toFixed(2) },
          { title: t("form_table_column_discount"), field: 'dct' , render: rowData => rowData.dct.toFixed(2)},
          { title: t("form_table_column_tax"), field: 'tax' , render: rowData => rowData.tax.toFixed(2)},
          { title: t("form_table_column_total"), field: 'total' , render: rowData => rowData.total.toFixed(2)},          
        ]}
        
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
            onClick: (event, rowData) => openDialogBox(rowData.id,'delete')
          },
          {
            icon: 'print',
            tooltip: t("detail_print_record_tip"),
            onClick: (event, rowData) => OrderPrint(rowData, configData)            
          },
          {
            icon:  () => <SettingsIcon />,
            tooltip: t("detail_invoice_record_tip"),
            onClick: (event, rowData) => openDialogBox(rowData.id,'invoice')
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
       </Grid>
      </Grid>        
  )
}

export default InvoiceTable;