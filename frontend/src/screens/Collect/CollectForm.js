import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { parseISO, format } from 'date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import DetailTable from './DetailTable';
import { useTranslation } from "react-i18next";
import { alpha } from '@material-ui/core/styles';

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

const base_url = 'api'
const endpoint = `${base_url}/collect`
const invoiceEndpoint = `${base_url}/invoice/`
const profesionalEndpoint = `${base_url}/profesional`
const DATE_FORMAT = 'yyyy-MM-dd';

const CollectForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	const { idToUpdate } = props;
	const [collectId, setCollectId] = useState(props.idToUpdate)
	useEffect(() => {
		let isActive = true;
		return () => { isActive = false };
	}, [collectId, setCollectId]);
	const [selectedDate, setSelectedDate] = useState(new Date());	

	// Getting Invoice data only once at the beggining
	const [invoiceData, setInvoiceData] = useState([]);
	useEffect(() => {

		retrieveInvoiceData()
	}, []); // Those ARE connectec

	const retrieveInvoiceData = () => {
		DataService.getAll(invoiceEndpoint)
			.then(response => {
				setInvoiceData(response.data)
				console.log(response.data);
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}


	const [descriptionValue,setDescriptionValue] = useState("")	

	// Getting profesional data only once at the beggining
	const [profesionalData, setProfesionalData] = useState([]);
	useEffect(() => {

		retrieveProfesionalData()
	}, []); // Those ARE connectec

	const retrieveProfesionalData = () => {
		DataService.getAll(profesionalEndpoint)
			.then(response => {
				setProfesionalData(response.data)
				// console.log(response.data);
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	//invoice combobox values
	const [invoiceValue, setInvoiceValue] = React.useState(invoiceData[0]);
	const [invoiceInputValue, setInvoiceInputValue] = React.useState('');	
	const [totalValue, setTotalValue] = React.useState(0.00);

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

	
	const [data, setData] = useState([]);
	useEffect(() => {
		let id = typeof idToUpdate === 'object' ? 0 : idToUpdate
		getData(id)
	}, []);

	const getData = (id) => {
		DataService.get(id, endpoint)
			.then(response => {
				// console.log("get data",response.data)		
				setCollectId(response.data.id)
				setTotalValue(response.data.total)		
				setSelectedDate(parseISO(response.data.date))				
				setInvoiceInputValue(response.data.invoice)
				setInvoiceValue(response.data.invoice)				
				setDescriptionValue(response.data.description)				
			})
			.catch(e => {
				console.log(e)
				if (e.response.status !== 404) {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)					
				} else {
					// setData({})
					console.log("Unexpected error: ", e)
				}

			});
	}

	const updateData = (values) => {
		DataService.update(endpoint, values)
			.then(response => {
				openNoticeBox("Notice", t("record_updated_successfully", {"table": t("collect_table_title")}))
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				openNoticeBox("Notice", t("record_created_successfully", {"table": t("collect_table_title")}))
				setCollectId(response.data.id)				
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const submitForm = (event) => {
		event.preventDefault();
		var newDate,newDueDate = ""
		newDate = format(selectedDate, DATE_FORMAT)		
		let values = {
			'invoice_id': invoiceValue.id,
			'date': newDate,						
			'description': descriptionValue			
		}
		if (collectId === 0) {
			addData(values)			
		}
		if (collectId > 0) {
			values.id = collectId
			// console.log(values)
			updateData(values)
		}
		// console.log("submit ",values)	

	}

	const handleReset = (event) => {

	}

	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<CssBaseline />
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

			<form className={classes.form} onSubmit={submitForm} onReset={handleReset}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography variant="h4" component="h4">
							{t("collect_form_collect_id")}: {collectId ? collectId : 0}
						</Typography>
						<Autocomplete
							id="invoice"
							// value={value}
							options={invoiceData}
							getOptionLabel={(option) => option.invoice ? option.invoice : "-"}
							onChange={(event, newValue) => {
								setInvoiceValue(newValue);
							}}
							inputValue={invoiceInputValue}
							onInputChange={(event, newInputValue) => {
								setInvoiceInputValue(newInputValue);
							}}

							value={invoiceValue ? invoiceValue : ""}
							renderInput={(params) => <TextField {...params} label={t("collect_form_lbl_collect_invoice")} variant="outlined" />}
							getOptionSelected={(option, value) => option.value === value.value}
						/>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								clearable="true"
								value={selectedDate}
								placeholder="2021-07-07"
								onChange={date => setSelectedDate(date)}
								// minDate={new Date()}
								format={DATE_FORMAT}
								autoOk
								name="date"
								id="date"
								variant="inline"
								inputVariant="outlined"
								style={{ marginTop: '5px' }}
							/>							
						</MuiPickersUtilsProvider>						
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="description"
							label={t("collect_form_lbl_collect_description")}
							name="description"
							multiline
          					maxRows={4}
							onChange={event => setDescriptionValue(event.target.value)}
							value={descriptionValue}
							style={{ marginTop: '5px' }}
						/>						
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="total"
							label={t("collect_form_lbl_collect_total")}
							name="total"
							onChange={event => setTotalValue(event.target.value)}
							value={totalValue}
							disabled={true}
						/>
					</Grid>
					<Grid item xs={8}>
						<DetailTable
							collectId={collectId}
							setCollectId={setCollectId}						
						/>
					</Grid>
					<Grid item xs={12}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{collectId === 0 ? t("save_form_button") : t("update_form_button")}

						</Button>
					</Grid>
				</Grid>
			</form>
			<Box mt={8}>

			</Box>

		</Paper>
	)
})

export default CollectForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
