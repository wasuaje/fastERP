import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { parseISO, format } from 'date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import dateFnsFormat from 'date-fns/format';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(18),
		maxWidth: 800,
		margin: 'auto',
		overflow: 'hidden',
		backgroundColor: 'white'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {

		margin: theme.spacing(3, 2, 2),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));


const DetailForm = (props) => {	
	const base_url = 'api'
	const productEndpoint = `${base_url}/product`
	const { idToUpdate } = props;
	const getData = props.getData;
	const [invoiceId, setInvoiceId] = useState(props.invoiceId)
	const [qtty, setQtty] = useState(1)
	const [price, setPrice] = useState(0.00)
	const openNoticeBox = props.openNoticeBox	

	const [productData, setProductData] = useState([]);
	useEffect(() => {

		retrieveProductData()
	}, []); 

	const retrieveProductData = () => {
		DataService.getAll(productEndpoint)
			.then(response => {
				setProductData(response.data)
				// console.log("product",response.data);
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const [productValue, setProductValue] = React.useState(productData[0]);
	const [productInputValue, setProductInputValue] = React.useState('');


	const addData = (values) => {      		  
		DataService.create(`${endpoint}/`, values)
		  .then(response => {        			
			// openNoticeBox("Notice", "Invoice created successfully")   			
			// setInvoiceId(response.data.id)
			// setData(emptyData)
			getData(invoiceId)
		  })
		  .catch(e => {  			  
			openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   							
		  });            
	  }  	  

	const AddDetail = (event) => {
		event.preventDefault();		
		 let values ={
			 'invoice_id': invoiceId,
			 'product_id': productValue.id,
			 'qtty': qtty,
			 'price': price,
		 }
		 console.log(values)					
		 addData(values)
		// if (invoiceId == 0) {
		// 	addData(values)		
		// 	// resetForm()		
		// }
		// if (invoiceId > 0 ) {			
		// 	values.id = invoiceId
		// 	// console.log(values)
		// 	updateData(values)
		// }
		// console.log("submit ",values)	
		
	 }

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Typography variant="h6" component="h6">
					Detail:
				</Typography>
			</Grid>
			<Grid item xs={2}>
			</Grid>
			<Grid item xs={2}>
				<Autocomplete
					id="product"
					// value={value}
					options={productData}
					getOptionLabel={(option) => option.name ? option.name : "-"}
					onChange={(event, newValue) => {
						setProductValue(newValue); 
						setPrice(newValue.price)
					}}
					inputValue={productInputValue}
					onInputChange={(event, newInputValue) => {
						setProductInputValue(newInputValue);
						setPrice(newInputValue.price)
					}}

					value={productValue ? productValue : ""}
					renderInput={(params) => <TextField {...params} label="Product" />}
					disabled = {invoiceId == 0 ? true : false}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					margin="normal"
					fullWidth
					id="qtty"
					label="qtty"
					name="qtty"
					onChange={event => setQtty(event.target.value)}
					value={qtty}
					style={{ marginTop: '-1px' }}
					disabled = {invoiceId == 0 ? true : false}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					margin="normal"
					fullWidth
					id="price"
					label="price"
					name="price"
					onChange={event => setPrice(event.target.value)}
					value={price}
					style={{ marginTop: '-1px' }}
					disabled = {invoiceId == 0 ? true : false}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					margin="normal"
					fullWidth
					id="total"
					label="total"
					name="total"
					disabled
					// onChange={event => { }}
					value={price*qtty}
					style={{ marginTop: '-1px' }}
				/>
			</Grid>
			<Grid item xs={2}>
				<Fab color="default" size="small" aria-label="add" onClick={ AddDetail } style={{ marginTop: '25px' }}  >
					<AddIcon />
				</Fab>
			</Grid>
		</Grid>
	)
}

const base_url = 'api'
const endpoint = `${base_url}/invoice-detail`
const invoiceEndpoint = `${base_url}/invoice`


const DetailTable = (props) => {

	const [invoiceId, setInvoiceId] = useState(props.invoiceId)
	const [detailTotal, setDetailTotal] = useState("0.00")

	const classes = useStyles();

	// INFO NOTIFICATION VARS
	const [infoOpen, setInfoOpen] = useState(false);
	const [infoTitle, setInfoTitle] = useState('');
	const [infoBody, setInfoBody] = useState('');
	//***********************

	//Dialog Vars
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogueTitle, setDialogueTitle] = useState('');
	const [dialogueBody, setDialogueBody] = useState('');
	//**********

	// DIALOG FUNCTIONS 
	const handleDialogOk = () => {
		setDialogOpen(false)
	};

	const handleDialogClose = () => {
		setDialogOpen(false)
	};

	const openDialogBox = (title, body) => {
		setDialogueTitle(title)
		setDialogueBody(body)
		setDialogOpen(true)
	};
	//*******************

	// Notification INFO functions
	const openNoticeBox = (title, body) => {
		setInfoTitle(title)
		setInfoBody(body)
		setInfoOpen(true)
	};

	const handleInfoClose = () => {
		setInfoOpen(false)
	};
	// *****************


	const [detailData, setDetailData] = useState([]);
	useEffect(() => {
		getData(invoiceId)
	}, []);

	const getData = (id) => {
		DataService.get(id, endpoint)
			.then(response => {
				console.log("get data", response.data)
				setDetailData(response.data)
				// setInvoiceNumber(response.data.id)
				// setInvoiceId(response.data.id)
				// setInvoiceValue(response.data.invoice)
				// // setSelectedDate(dateFnsFormat(response.data.date, 'dd/MM/yyyy'))			
				// // setSelectedDate(response.data.date)			
				// setSelectedDate(parseISO(response.data.date))
				// setProductInputValue(response.data.product.name)
				// setProductValue(response.data.product)
				// setProfesionalInputValue(response.data.profesional.name)
				// setProfesionalValue(response.data.profesional)
				// console.log("get data2", detailData)
				var  sumdetail = 0;
				response.data.forEach (function(record){
        				sumdetail += record.total;
    				});
				setDetailTotal(sumdetail)
					// console.log("sumdet",sumdetail)
			})
			.catch(e => {
				if (e.response.status != '404') {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
					// setData(emptyData)
				} else {
					// setData(emptyData)
					console.log("")
				}

			});
	}

	const deleteDetail = (id) => {      
		var dataDelete = {'id': id};
		DataService.delete(endpoint, dataDelete)
		  .then(response => {        
			// openNoticeBox("Notice", "Invoice deleted successfully")   
			getData(invoiceId)
		  })
		  .catch(e => {  
			openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   
		  });            
	  }    
	 
	  
	return (
		<Grid container spacing={2}>
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

			<MaterialTable
				title="Detail"
				columns={[
					{ title: 'ID', field: 'id' },
					{ title: 'Product', field: 'product.name' },
					{ title: 'Qtty', field: 'qtty' },
					{ title: 'Price', field: 'price' },
					{ title: 'Total', field: 'total' }
				]}
				data={detailData}
				actions={[					
					{
						icon: 'delete',
						tooltip: 'Delete detail',
						onClick: (event, rowData) => deleteDetail(rowData.id)
					}
				]}
				options={{
					actionsColumnIndex: -1,
					search: false,
					paging: false
				}}
				components={{
					Toolbar: props => (
						<div style={{ backgroundColor: '#e8eaf5' }}>
							<DetailForm
								invoiceId={invoiceId}
								openNoticeBox={openNoticeBox}
								getData={getData}
							/>
						</div>
					)
				}}
			/>
			<div style={{ align: 'right', width: '500px', textAlignLast: 'right' }}>
				<Typography variant="h5" component="h5">
					Total: {parseFloat(detailTotal).toFixed(2) }
				</Typography>
			</div>
		</Grid>
	)
}

export default DetailTable;