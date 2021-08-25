import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import { useTranslation } from "react-i18next";


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
	const getData = props.getData;
	const { cashId, setCashId, amountOpenValue, amountCloseValue,setAmountOpenValue, setAmountCloseValue } = props
	const [amount, setAmount] = useState(0.00)
	const [concept, setConcept] = useState("")
	const openNoticeBox = props.openNoticeBox
	const { t } = useTranslation();		


	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				// openNoticeBox("Notice", "Cash created successfully")   			
				// setCashId(response.data.id)
				// setData(emptyData)
				getData(cashId)
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}

	const AddDetail = (event) => {
		event.preventDefault();
		if (concept === '' || amount == 0) {
			openNoticeBox("Error",  t("fill_all_fields_msg"))
			return false
		}
		let values = {
			'cash_id': cashId,
			'concept': concept,			
			'amount': amount,
		}
		//  console.log(values)					
		addData(values)
		// if (cashId == 0) {
		// 	addData(values)		
		// 	// resetForm()		
		// }
		// if (cashId > 0 ) {			
		// 	values.id = cashId
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
			<Grid item xs={3}>
			</Grid>			
			<Grid item xs={3}>
				<TextField
					margin="normal"
					fullWidth
					id="concept"
					label={t("cash_form_detail_lbl_concept")}
					name="concept"
					onChange={event => setConcept(event.target.value)}
					value={concept}
					style={{ marginTop: '-1px' }}
					disabled={cashId === 0 ? true : false}
				/>
			</Grid>
			<Grid item xs={3}>
				<TextField
					margin="normal"
					fullWidth
					id="amount"
					label={t("cash_form_detail_lbl_amount")}
					name="amount"
					onChange={event => setAmount(event.target.value)}
					value={amount ? amount : 0}
					style={{ marginTop: '-1px' }}
					disabled={cashId === 0 ? true : false}
				/>
			</Grid>			
			<Grid item xs={3}>
				<Fab color="default" size="small" aria-label="add" onClick={AddDetail} style={{ marginTop: '-5px' }} disabled={cashId === 0 ? true : false} >
					<AddIcon />
				</Fab>
			</Grid>
		</Grid>
	)
}

const base_url = 'api'
const endpoint = `${base_url}/cash-detail`
const cashEndpoint = `${base_url}/cash`


const DetailTable = (props) => {	
	const { t } = useTranslation();

	const { cashId, setCashId, amountOpenValue, amountCloseValue,setAmountOpenValue, setAmountCloseValue} = props	

	const [detailSubTotal, setDetailSubTotal] = useState("0.00")

	// const [detailDctTotal, setDetailDctTotal] = useState("0.00")
	// useEffect(() => {
	// 	setDetailDctTotal(amountOpenValue)
	// }, [dctValue, detailSubTotal ]);

	// const [detailTaxTotal, setDetailTaxTotal] = useState("0.00")
	// useEffect(() => {
	// 	let tmpdct = detailSubTotal*(dctValue/100)
	// 	setDetailTaxTotal((detailSubTotal-tmpdct)*(taxValue/100))
	// }, [taxValue, detailSubTotal ]);

	const [detailTotal, setDetailTotal] = useState("0.00")							
	useEffect(() => {
		// console.log(detailSubTotal,detailDctTotal,detailTaxTotal)
		// let tmpdct = detailSubTotal*(dctValue/100)
		// let tmptax = (detailSubTotal-tmpdct)*(taxValue/100)
		setDetailTotal(amountOpenValue+detailSubTotal)
		setAmountCloseValue(parseFloat(amountOpenValue)+parseFloat(detailSubTotal))
	}, [ detailSubTotal, amountOpenValue  ]);

	const [showForm, setShowForm] = useState(false);

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
		getData(cashId)
	}, []);

	const getData = (id) => {		
		DataService.get(id, endpoint)
			.then(response => {
				//  console.log("get data", response.data)
				setDetailData(response.data)				
				var sumdetail = 0;
				response.data.forEach(function (record) {
					sumdetail += record.amount;
				});
				setDetailSubTotal(sumdetail)				
			})
			.catch(e => {
				if (e.response.status !== '404') {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
					// setData(emptyData)
				} else {
					// setData(emptyData)
					console.log("")
				}

			});
	}

	const deleteDetail = (id) => {
		var dataDelete = { 'id': id };
		DataService.delete(endpoint, dataDelete)
			.then(response => {
				// openNoticeBox("Notice", "Cash deleted successfully")   
				getData(cashId)
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
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
					{ title: t("cash_form_detail_concept"), field: 'concept' },
					{ title: t("cash_form_detail_amount"), field: 'amount',  render: rowData => rowData.amount.toFixed(2) },					
				]}
				data={detailData}
				actions={[
					{
						icon: 'delete',
						tooltip: t("detail_delete_record_tip"),
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
								cashId={cashId}
								openNoticeBox={openNoticeBox}
								getData={getData}								
								amountOpenValue={amountOpenValue}
								amountCloseValue={amountCloseValue}
								setAmountOpenValue={setAmountOpenValue}
								setAmountCloseValue={setAmountCloseValue}
							/>
						</div>
					)
				}}
			/>
			<div style={{ align: 'right', width: '500px', textAlignLast: 'right' }}>
				<Typography variant="h6" component="h6">
					Monto Apertura: {parseFloat(amountOpenValue).toFixed(2)}
				</Typography>
				<Typography variant="h6" component="h6">
					Total Movimientos: {parseFloat(detailSubTotal).toFixed(2)}
				</Typography>				
				<Typography variant="h5" component="h5">
					Monto Cierre: {parseFloat(amountCloseValue).toFixed(2)}
				</Typography>
			</div>
		</Grid>
	)
}

export default DetailTable;