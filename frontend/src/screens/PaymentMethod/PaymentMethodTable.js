import React,  { useEffect, useState }  from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import PaymentMethodForm from './PaymentMethodForm';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import PatchedPagination from '../../components/PatchedPagination'
import { useTranslation } from "react-i18next";

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



  const PaymentMethodModal = React.forwardRef((props, ref) => {
    const { handleFormCLose,showForm,idToUpdate } = props;
    
    return(
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">  
      <PaymentMethodForm idToUpdate={idToUpdate}/>
    </Modal>
    )})


const base_url = 'api'
const endpoint = `${base_url}/payment-method`
   

const PaymentMethodTable = React.forwardRef((props, ref) => {  
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  useEffect(() => {
    
    retrieveData()
  }, []); // Those ARE connectec
 
  
  const retrieveData = () => {  
    DataService.getAll(endpoint)
      .then(response => {
        setData(response.data)
        // console.log(response.data);
      })
      .catch(e => {
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   
      });
  }   

  const deleteData = (id) => {      
    var dataDelete = {'id': id};
    DataService.delete(endpoint, dataDelete)
      .then(response => {        
        openNoticeBox("Notice",t("record_deleted_success")) 
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

  // FORM VARS
  const [idToUpdate, setidToUpdate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // FORM FUNCTIONS
  const handleFormCLose = () => {    
    retrieveData()
    setShowForm(false);    
  };
  
  const handleFormOpen = (id=null) => {
    setidToUpdate(id)    
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

 // DIALOG FUNCTIONS 
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

  

  // *******************
  

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
                                       
    <PaymentMethodModal handleFormCLose={handleFormCLose} showForm={showForm} idToUpdate={idToUpdate}/>
    <Paper className={classes.paper} >    
    
    <MaterialTable    
      title={t("payment_method_table_title")}
      columns={[
        { title: 'ID', field: 'id'},
        { title: t("product_category_table_column_name"), field: 'name' },        
      ]}
      // data={[
      //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
      // ]}   
      data = {data}      
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
        }        
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
    </Paper>
    <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleFormOpen} style={{ marginTop: '10px' }}  >
          <AddIcon />
    </Fab>
    </div>
  )
})

export default PaymentMethodTable;

