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
const endpoint = `${base_url}/purchase`
const providerEndpoint = `${base_url}/provider`
const profesionalEndpoint = `${base_url}/profesional`
const DATE_FORMAT = 'yyyy-MM-dd';

const PurchaseForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	const { idToUpdate } = props;
	const [purchaseId, setPurchaseId] = useState(props.idToUpdate)
	useEffect(() => {
		let isActive = true;
		return () => { isActive = false };
	}, [purchaseId, setPurchaseId]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedDueDate, setSelectedDueDate] = useState(new Date());

	// Getting Provider data only once at the beggining
	const [providerData, setProviderData] = useState([]);
	useEffect(() => {

		retrieveProviderData()
	}, []); // Those ARE connectec

	const retrieveProviderData = () => {
		DataService.getAll(providerEndpoint)
			.then(response => {
				setProviderData(response.data)
				// console.log(response.data);
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}


	const [bodyNoteValue,setBodyNoteValue] = useState("")
	const [footNoteValue, setFootNoteValue] = useState("")
	const [dctValue, setDctValue] = useState("")
	const [taxValue, setTaxValue] = useState("")

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

	//provider combobox values
	const [providerValue, setProviderValue] = React.useState(providerData[0]);
	const [providerInputValue, setProviderInputValue] = React.useState('');
	const [profesionalValue, setProfesionalValue] = React.useState(profesionalData[0]);
	const [profesionalInputValue, setProfesionalInputValue] = React.useState('');
	const [purchaseValue, setPurchaseValue] = React.useState("");

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
				setPurchaseId(response.data.id)
				setPurchaseValue(response.data.invoice)		
				setSelectedDate(parseISO(response.data.date))
				setSelectedDueDate(parseISO(response.data.due_date))
				setProviderInputValue(response.data.provider.name)
				setProviderValue(response.data.provider)
				setProfesionalInputValue(response.data.employee.name)
				setProfesionalValue(response.data.employee)
				setBodyNoteValue(response.data.body_note)
				setFootNoteValue(response.data.foot_note)
				setDctValue(response.data.dct)
				setTaxValue(response.data.tax)
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
				openNoticeBox("Notice", t("record_updated_successfully", {"table": t("purchase_table_title")}))
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				openNoticeBox("Notice", t("record_created_successfully", {"table": t("purchase_table_title")}))
				setPurchaseId(response.data.id)				
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const submitForm = (event) => {
		event.preventDefault();
		var newDate,newDueDate = ""
		newDate = format(selectedDate, DATE_FORMAT)
		newDueDate = format(selectedDueDate, DATE_FORMAT)
		let values = {
			'provider_id': providerValue.id,
			'date': newDate,
			'due_date': newDueDate,
			'employee_id': profesionalValue.id,
			'invoice': `COMP-${purchaseValue.replace('COMP-', '')}`,
			'dct': dctValue,
			'tax': taxValue,
			'body_note': bodyNoteValue,
			'foot_note': footNoteValue
		}
		if (purchaseId === 0) {
			addData(values)			
		}
		if (purchaseId > 0) {
			values.id = purchaseId
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
						{t("purchase_form_purchase_id")}: {purchaseId ? purchaseId : 0}
						</Typography>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="purchase"
							label={t("purchase_form_lbl_purchase_purchase")}
							name="purchase"
							onChange={event => setPurchaseValue(event.target.value)}
							value={purchaseValue}
						/>
						<Autocomplete
							id="provider"
							// value={value}
							options={providerData}
							getOptionLabel={(option) => option.name ? option.name : "-"}
							onChange={(event, newValue) => {
								setProviderValue(newValue);
							}}
							inputValue={providerInputValue}
							onInputChange={(event, newInputValue) => {
								setProviderInputValue(newInputValue);
							}}

							value={providerValue ? providerValue : ""}
							renderInput={(params) => <TextField {...params} label={t("purchase_form_lbl_purchase_provider")} variant="outlined" />}
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
							<KeyboardDatePicker
								clearable="true"
								value={selectedDueDate}
								placeholder="2021-07-07"
								onChange={dueDate => setSelectedDueDate(dueDate)}
								// minDate={new Date()}
								format={DATE_FORMAT}
								autoOk
								name="due_date"
								id="due_date"
								variant="inline"
								inputVariant="outlined"
								style={{ marginTop: '5px' }}
							/>
						</MuiPickersUtilsProvider>
						<Autocomplete
							id="profesional"
							label={t("purchase_form_lbl_purchase_employee")}
							name="profesional"
							// value={value}
							getOptionLabel={(option) => option.name ? option.name : "-"}
							onChange={(event, newValue) => {
								setProfesionalValue(newValue);
							}}
							inputValue={profesionalInputValue}
							onInputChange={(event, newInputValue) => {
								setProfesionalInputValue(newInputValue);
							}}
							options={profesionalData}
							value={profesionalValue ? profesionalValue : ""}
							renderInput={(params) => <TextField {...params} label={t("purchase_form_lbl_purchase_employee")} variant="outlined" />}
							style={{ marginTop: '7px' }}
							getOptionSelected={(option, value) => option.value === value.value}


						/>					
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="body_note"
							label={t("purchase_form_lbl_purchase_body_note")}
							name="body_note"
							multiline
          					maxRows={4}
							onChange={event => setBodyNoteValue(event.target.value)}
							value={bodyNoteValue}
							style={{ marginTop: '5px' }}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="foot_note"
							label={t("purchase_form_lbl_purchase_foot_note")}
							name="foot_note"
							multiline
          					maxRows={4}
							onChange={event => setFootNoteValue(event.target.value)}
							value={footNoteValue}
							style={{ marginTop: '-2px' }}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="dct"
							label={t("purchase_form_lbl_purchase_discount")}
							name="dct"
							onChange={event => setDctValue(event.target.value)}
							value={dctValue}
							style={{ marginTop: '-2px' }}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="tax"
							label={t("purchase_form_lbl_purchase_tax")}
							name="tax"
							onChange={event => setTaxValue(event.target.value)}
							value={taxValue}
							style={{ marginTop: '-2px' }}
						/>
					</Grid>
					<Grid item xs={8}>
						<DetailTable
							purchaseId={purchaseId}
							setPurchaseId={setPurchaseId}
							dctValue={dctValue}
							taxValue={taxValue}
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
							{purchaseId === 0 ? t("save_form_button") : t("update_form_button")}

						</Button>
					</Grid>
				</Grid>
			</form>
			<Box mt={8}>

			</Box>

		</Paper>
	)
})

export default PurchaseForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
