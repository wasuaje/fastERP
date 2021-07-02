import React,  { useEffect, useState }  from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import ClientForm from './ClientForm';
import API from "../api";
import useDataApi from "../apiHook"
import Typography from '@material-ui/core/Typography';
import GenericDialogBox from '../components/GenericDialogBox';
import InfoBox from '../components/InfoBox';

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


// let  cData = []

// API("client/", "get")
//   .then((data) => {
//     console.log("data:", data);
//     cData = data
//   })
//   .catch((err) => {  
//     console.log("Error getting data: ", err.response);
//         });




  const ClientModal = (props) => {
    const { handleFormCLose,showForm,idToUpdate } = props;
    
    return(
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">  
      <ClientForm idToUpdate={idToUpdate}/>
    </Modal>
    )}

export default function ClientTable() {  
  
  // const [clientData, setclientData] = useState(cData);
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
    doFetch(new Date().getTime())
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
  doFetch(new Date().getTime())
  setInfoOpen(false)
};
// *****************

 // DIALOG FUNCTIONS 
  const handleDialogOk = () => {
    doDelete({'id': idToDelete})           
    setDialogOpen(false) 
    openNoticeBox("Notice", "Client deleted succesfully")
  };

  const handleDialogClose = () => {
    setidToDelete(null)                
    doFetch(new Date().getTime())
    setDialogOpen(false) 
  };

  const openDialogBox = (id) => {        
    setDialogueTitle("Delete Record?")
    setDialogueBody("Are you sure to delete Client Id: "+id)
    // console.log(dialogOpen, dialogueTitle, dialogueBody)
    setidToDelete(id)
    setDialogOpen(true)
  };

  

  // *******************
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'client',
    'get',
    {},
    'yes',
    [],
  );
  

  const [{ dataDelete, isLoadingDelete, isErrorDelete }, doRefreshDelete, doDelete] = useDataApi(
    'client',
    'delete',
    {},
    'yes',
    [],
  );  

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
                                       
    <ClientModal handleFormCLose={handleFormCLose} showForm={showForm} idToUpdate={idToUpdate}
    />
    <Paper className={classes.paper}>    
    
    <MaterialTable    
      title=""
      columns={[
        { title: 'ID', field: 'id'},
        { title: 'Name', field: 'name' },
        { title: 'Phone', field: 'phone' },        
      ]}
      // data={[
      //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
      // ]}   
      data = {data}
      components={{
        Body: (props) => {if (isError) {
          return (<Typography  variant="h6">Can´t Communicate with backend</Typography>)
          }else{
          return (<Typography  variant="h6">No records found</Typography>)
          }
        }
                  
      }}
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
    </Paper>
    <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleFormOpen} style={{ marginTop: '10px' }}  >
          <AddIcon />
    </Fab>
    </div>
  )
}