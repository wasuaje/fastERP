import React,  { useEffect, useState }  from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import InvoiceForm from './InvoiceForm';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import Grid from '@material-ui/core/Grid';

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
    const { handleFormCLose,showForm,idToUpdate } = props;
    
    return(
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">  
      <InvoiceForm idToUpdate={idToUpdate}/>
    </Modal>
    )})


const base_url = 'api'
const endpoint = `${base_url}/invoice/`
   
const InvoiceTable = (props) => {
   
  const [data, setData] = useState([]);
  useEffect(() => {
    
    retrieveData()
  }, []); // Those ARE connectec
 
  
  const retrieveData = () => {  
    DataService.getAll(endpoint)
      .then(response => {
        var tempData = response.data;
        tempData.forEach (function(record){
          // var sumEach = 0.00
          record.invoice_detail.forEach ((detail)=>{
            record.total+=detail.total            
          })
          // tempData.total = sumEach; 
        });
        setData(tempData)
        // console.log(tempData);
      })
      .catch(e => {
        // console.log(e);
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   
      });
  }   

  const deleteData = (id) => {      
    var dataDelete = {'id': id};
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

  // FORM VARS
  const [idToUpdate, setidToUpdate] = useState(null);
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
    setDialogueTitle("Delete Record?")
    setDialogueBody("Are you sure to delete Invoice Id: "+id)
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
                                       
    <InvoiceModal handleFormCLose={handleFormCLose} showForm={showForm} idToUpdate={idToUpdate}/>    
    
    <MaterialTable    
      title="-"
      onPageChange = {() => {}}
      columns={[
        { title: 'ID', field: 'id'},
        { title: 'Date', field: 'date' },
        { title: 'Invoice', field: 'invoice' },        
        { title: 'Client', field: 'client.name' },        
        { title: 'Total', field: 'total' },        
      ]}
      // data={[
      //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
      // ]}   
      data = {data}      
      actions={[
        {
          icon: 'edit',
          tooltip: 'Edit User',
          onClick: (event, rowData) => handleFormOpen(rowData.id)
        },
        {
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event, rowData) => openDialogBox(rowData.id)
        }        
      ]}
      options={{        
        actionsColumnIndex: -1
      }}      
    />    
    
    <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleFormOpen} style={{ marginTop: '10px' }}  >
          <AddIcon />
    </Fab>
    </div>
  )
}

export default InvoiceTable;