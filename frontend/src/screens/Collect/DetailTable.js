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
	const { collectId, setCollectId, invoiceData, bankData, setBankData, paymentMethodData, setPaymentMethodData } = props	
	const [total, setTotal] = useState(0.00)
	const openNoticeBox = props.openNoticeBox
	const { t } = useTranslation();	

	const [amount, setAmount] = React.useState(0);
	const [reference, setReference] = React.useState("");	
	
	const [bankValue, setBankValue] = React.useState("-");
	const [bankInputValue, setBankInputValue] = React.useState('');


	const [paymentMethodValue, setPaymentMethodValue] = React.useState("-");
	const [paymentMethodInputValue, setPaymentMethodInputValue] = React.useState('');

	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				// openNoticeBox("Notice", "Collect created successfully")   			
				// setCollectId(response.data.id)
				// setData(emptyData)
				getData(collectId)
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const AddDetail = (event) => {
		event.preventDefault();
		if (typeof paymentMethodValue === 'undefined') {
			openNoticeBox("Error",  t("should_pick_a_paymentMethod"))
			return false
		}
		let values = {
			'collect_id': collectId,
			'payment_method_id': paymentMethodValue.id,			
			'reference': reference,
			'amount': amount,
			'bank_id': typeof bankValue === 'undefined' ? null : bankValue.id
		}
		//  console.log(values)					
		addData(values)
		// if (collectId == 0) {
		// 	addData(values)		
		// 	// resetForm()		
		// }
		// if (collectId > 0 ) {			
		// 	values.id = collectId
		// 	// console.log(values)
		// 	updateData(values)
		// }
		// console.log("submit ",values)	

	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Typography variant="h6" component="h6">
					{t("collect_form_detail_lbl_detail")}
				</Typography>
			</Grid>
			<Grid item xs={2}>
			</Grid>
			<Grid item xs={2}>
				<Autocomplete
					id="paymentMethod"
					// value={value}
					options={paymentMethodData}
					getOptionLabel={(option) => option.name ? option.name : "-"}
					onChange={(event, newValue) => {
						setPaymentMethodValue(newValue);
						setTotal(newValue.total)
					}}
					inputValue={paymentMethodInputValue}
					onInputChange={(event, newInputValue) => {
						setPaymentMethodInputValue(newInputValue);
						setTotal(newInputValue.total)
					}}

					value={paymentMethodValue ? paymentMethodValue : ""}
					renderInput={(params) => <TextField {...params} label={t("collect_form_detail_lbl_paymentMethod")} />}
					disabled={collectId === 0 ? true : false}
					getOptionSelected={(option, value) => option.value === value.value}
				/>				
			</Grid>
			<Grid item xs={2}>
				<Autocomplete
					id="bank"
					// value={value}
					options={bankData}
					getOptionLabel={(option) => option.name ? option.name : "-"}
					onChange={(event, newValue) => {
						setBankValue(newValue);
						setTotal(newValue.total)
					}}
					inputValue={bankInputValue}
					onInputChange={(event, newInputValue) => {
						setBankInputValue(newInputValue);
						setTotal(newInputValue.total)
					}}

					value={bankValue ? bankValue : ""}
					renderInput={(params) => <TextField {...params} label={t("collect_form_detail_lbl_bank")} />}
					disabled={collectId === 0 ? true : false}
					getOptionSelected={(option, value) => option.value === value.value}
				/>				
			</Grid>			
			<Grid item xs={2}>
				<TextField
					margin="normal"
					fullWidth
					id="amount"
					label={t("collect_form_detail_lbl_amount")}
					name="amount"
					onChange={event => setAmount(event.target.value)}
					value={amount}
					style={{ marginTop: '-1px' }}
					disabled={collectId === 0 ? true : false}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					margin="normal"
					fullWidth
					id="reference"
					label={t("collect_form_detail_lbl_reference")}
					name="reference"
					onChange={event => setReference(event.target.value)}
					value={reference ? reference : ""}
					style={{ marginTop: '-1px' }}
					disabled={collectId === 0 ? true : false}
				/>
			</Grid>			
			<Grid item xs={2}>
				<Fab color="default" size="small" aria-label="add" onClick={AddDetail} style={{ marginTop: '-5px' }}  >
					<AddIcon />
				</Fab>
			</Grid>
		</Grid>
	)
}

const base_url = 'api'
const endpoint = `${base_url}/collect-detail`
const collectEndpoint = `${base_url}/collect`


const DetailTable = (props) => {	
	const { t } = useTranslation();

	const { collectId, setCollectId, dctValue, taxValue, invoiceData, bankData, setBankData, paymentMethodData, setPaymentMethodData } = props	
	// console.log("invoice data:",invoiceData)
	const [invoiceTotal, setInvoiceTotal] = useState("0.00")
	useEffect(() => {
		if (typeof invoiceData !== 'undefined') setInvoiceTotal(invoiceData.total)		
	}, [invoiceData]);

	const [collectTotal, setCollectTotal] = useState("0.00")
	useEffect(() => {
		// setCollectTotal(invoiceTotal)		
	}, [invoiceData ]);

	// const [detailTaxTotal, setDetailTaxTotal] = useState("0.00")
	// useEffect(() => {
	// 	let tmpdct = invoiceTotal*(dctValue/100)
	// 	setDetailTaxTotal((invoiceTotal-tmpdct)*(taxValue/100))
	// }, [taxValue, invoiceTotal ]);

	const [missingTotal, setMissingTotal] = useState("0.00")							
	useEffect(() => {
		// console.log(invoiceTotal,collectTotal,detailTaxTotal)		
		if (typeof invoiceData !== 'undefined') setMissingTotal(invoiceTotal-collectTotal)
	}, [collectTotal, invoiceData, invoiceTotal ]);

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
		getData(collectId)
	}, []);

	const getData = (id) => {
		DataService.get(id, endpoint)
			.then(response => {
				// console.log("get data", response.data)
				setDetailData(response.data)				
				var sumdetail = 0;
				response.data.forEach(function (record) {
					sumdetail += record.amount;
				});
				var totalfact = typeof invoiceData === 'undefined' ? "0.00" : invoiceData.total 
				setCollectTotal(sumdetail)	
				setInvoiceTotal(totalfact)			
				setMissingTotal(totalfact-sumdetail)
			})
			.catch(e => {
				// console.log(e)
				if (e.response.status !== '404') {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
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
				// openNoticeBox("Notice", "Collect deleted successfully")   
				getData(collectId)
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
					{ title: t("collect_form_detail_payment_method"), field: 'payment_method.name' },
					{ title: t("collect_form_detail_bank"), field: 'bank.name' },
					{ title: t("collect_form_detail_amount"), field: 'amount' },
					{ title: t("collect_form_detail_reference"), field: 'reference' }					
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
								collectId={collectId}
								openNoticeBox={openNoticeBox}
								getData={getData}
								bankData={bankData}						
								setBankData={setBankData}
								paymentMethodData={paymentMethodData}
								setPaymentMethodData={setPaymentMethodData}							
							/>
						</div>
					)
				}}
			/>
			<div style={{ align: 'right', width: '500px', textAlignLast: 'right' }}>
				<Typography variant="h6" component="h6">
				{t("collect_form_detail_lbl_total_invoice")}: {parseFloat(invoiceTotal).toFixed(2)}
				</Typography>
				<Typography variant="h6" component="h6">
				{t("collect_form_detail_lbl_total_collected")}: {parseFloat(collectTotal).toFixed(2)}
				</Typography>				
				<Typography variant="h5" component="h5">
				{t("collect_form_detail_lbl_missing_to_collect")}: {parseFloat(missingTotal).toFixed(2)}
				</Typography>
			</div>
		</Grid>
	)
}

export default DetailTable;