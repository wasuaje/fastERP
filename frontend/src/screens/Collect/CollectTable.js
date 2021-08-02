import React, { useEffect, useState, useRef } from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import CollectForm from './CollectForm';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import PatchedPagination from '../../components/PatchedPagination'
import { useTranslation } from "react-i18next";
import { parseISO, format } from 'date-fns';

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


const CollectModal = React.forwardRef((props, ref) => {
  const { handleFormCLose, showForm, idToUpdate } = props;

  return (
    <Modal
      open={showForm}
      onClose={handleFormCLose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">
      <CollectForm idToUpdate={idToUpdate} />      
    </Modal>
  )
})


const baseURL = process.env.REACT_APP_PUBLIC_API_URL
const base_url = 'api'
const endpoint = `${base_url}/collect/`
const endpointPaginated = `${baseURL}/api/collect/`

const CollectTable = (props) => {
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
        openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
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
  const [collectObj, setCollectObj] = useState({});
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

      <CollectModal handleFormCLose={handleFormCLose} showForm={showForm} idToUpdate={idToUpdate} />      

      <MaterialTable
        title={t("collect_table_title")}
        tableRef={tableRef}
        columns={[
          { title: 'ID', field: 'id' },
          { title: t("form_table_column_date"), field: 'date' , render: rowData => format(parseISO(rowData.date), 'dd/MM/yyyy') },
          { title: t("form_table_column_invoice"), field: 'invoice.invoice' },          
          { title: t("form_table_column_client"), field: 'invoice.client.name' },
          { title: t("form_table_column_description"), field: 'description'},          
          { title: t("form_table_column_total"), field: 'total' , render: rowData => rowData.total.toFixed(2)}          
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
            onClick: (event, rowData) => openDialogBox(rowData.id)
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

export default CollectTable;