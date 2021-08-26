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
	const { inventoryId, setInventoryId, productData, setProductData } = props
	const [productValue, setProductValue] = React.useState("-");
	const [productInputValue, setProductInputValue] = React.useState('');	
	const [qtty, setQtty] = useState(1)
	const openNoticeBox = props.openNoticeBox
	const { t } = useTranslation();		


	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				// openNoticeBox("Notice", "Inventory created successfully")   			
				// setInventoryId(response.data.id)
				// setData(emptyData)
				getData(inventoryId)
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}

	const AddDetail = (event) => {
		event.preventDefault();
		if ( qtty == 0 || productInputValue == "-") {
			openNoticeBox("Error",  t("fill_all_fields_msg"))
			return false
		}
		let values = {
			'inventory_id': inventoryId,					
			'qtty': qtty,
			'product_id': productValue.id,
		}
		//  console.log(values)					
		addData(values)
		// if (inventoryId == 0) {
		// 	addData(values)		
		// 	// resetForm()		
		// }
		// if (inventoryId > 0 ) {			
		// 	values.id = inventoryId
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
			<Grid item xs={4}>
				<Autocomplete
					id="product"
					// value={value}
					options={productData}
					getOptionLabel={(option) => option.name ? option.name : "-"}
					onChange={(event, newValue) => {
						setProductValue(newValue);						
					}}
					inputValue={productInputValue}
					onInputChange={(event, newInputValue) => {
						setProductInputValue(newInputValue);					
					}}

					value={productValue ? productValue : ""}
					renderInput={(params) => <TextField {...params} label={t("invoice_form_detail_lbl_product")} />}
					disabled={inventoryId === 0 ? true : false}
					getOptionSelected={(option, value) => option.value === value.value}


				/>
			</Grid>
			<Grid item xs={4}>
				<TextField
					margin="normal"
					fullWidth
					id="qtty"
					label={t("inventory_form_detail_lbl_qtty")}
					name="qtty"
					onChange={event => setQtty(event.target.value)}
					value={qtty ? qtty : 0}
					style={{ marginTop: '-1px' }}
					disabled={inventoryId === 0 ? true : false}
				/>
			</Grid>									
			<Grid item xs={2}>
				<Fab color="default" size="small" aria-label="add" onClick={AddDetail} style={{ marginTop: '-5px' }} disabled={inventoryId === 0 ? true : false} >
					<AddIcon />
				</Fab>
			</Grid>
		</Grid>
	)
}

const base_url = 'api'
const endpoint = `${base_url}/inventory-detail`
const inventoryEndpoint = `${base_url}/inventory`


const DetailTable = (props) => {	
	const { t } = useTranslation();

	const { inventoryId, setInventoryId, productData, setProductData} = props	

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
		setDetailTotal(detailSubTotal)
		
	}, [ detailSubTotal  ]);

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
		getData(inventoryId)
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
				// openNoticeBox("Notice", "Inventory deleted successfully")   
				getData(inventoryId)
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
					{ title: t("invoice_form_detail_product"), field: 'product.name' },
					{ title: t("inventory_form_detail_qtty"), field: 'qtty'}					
					
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
								inventoryId={inventoryId}
								openNoticeBox={openNoticeBox}
								getData={getData}								
								productData={productData}
								setProductData={setProductData}
							/>
						</div>
					)
				}}
			/>
			<div style={{ align: 'right', width: '500px', textAlignLast: 'right' }}>
				
			</div>
		</Grid>
	)
}

export default DetailTable;