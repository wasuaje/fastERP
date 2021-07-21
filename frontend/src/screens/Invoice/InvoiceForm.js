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
const endpoint = `${base_url}/invoice`
const clientEndpoint = `${base_url}/client`
const profesionalEndpoint = `${base_url}/profesional`
const DATE_FORMAT = 'yyyy-MM-dd';

const InvoiceForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	const { idToUpdate } = props;
	const [invoiceId, setInvoiceId] = useState(props.idToUpdate)
	useEffect(() => {
		let isActive = true;
		return () => { isActive = false };
	}, [invoiceId, setInvoiceId]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedDueDate, setSelectedDueDate] = useState(new Date());

	// Getting Client data only once at the beggining
	const [clientData, setClientData] = useState([]);
	useEffect(() => {

		retrieveClientData()
	}, []); // Those ARE connectec

	const retrieveClientData = () => {
		DataService.getAll(clientEndpoint)
			.then(response => {
				setClientData(response.data)
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


	//client combobox values
	const [clientValue, setClientValue] = React.useState(clientData[0]);
	const [clientInputValue, setClientInputValue] = React.useState('');
	const [profesionalValue, setProfesionalValue] = React.useState(profesionalData[0]);
	const [profesionalInputValue, setProfesionalInputValue] = React.useState('');
	const [invoiceValue, setInvoiceValue] = React.useState("");

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

	const emptyData = {
		'name': '',
		'phone': '',
		'email': '',
		'age': '',
		'gender': '',
		'address': '',
		'state': '',
		'city': '',
		'zip': '',
		'dct': '',
		'tax': '',
	}

	const [data, setData] = useState([]);
	useEffect(() => {
		let id = typeof idToUpdate === 'object' ? 0 : idToUpdate
		getData(id)
	}, []);

	const getData = (id) => {
		DataService.get(id, endpoint)
			.then(response => {
				// console.log("get data",response.data)		
				setInvoiceId(response.data.id)
				// setInvoice (response.data.id)
				setInvoiceValue(response.data.invoice)
				// setSelectedDate(dateFnsFormat(response.data.date, 'dd/MM/yyyy'))			
				// setSelectedDate(response.data.date)			
				setSelectedDate(parseISO(response.data.date))
				setSelectedDueDate(parseISO(response.data.due_date))
				setClientInputValue(response.data.client.name)
				setClientValue(response.data.client)
				setProfesionalInputValue(response.data.profesional.name)
				setProfesionalValue(response.data.profesional)
				setBodyNoteValue(response.data.body_note)
				setFootNoteValue(response.data.foot_note)
				setDctValue(response.data.dct)
				setTaxValue(response.data.tax)
			})
			.catch(e => {
				if (e.response.status !== 404) {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
					// setData(emptyData)
				} else {
					setData(emptyData)
				}

			});
	}

	const updateData = (values) => {
		DataService.update(endpoint, values)
			.then(response => {
				openNoticeBox("Notice", "Invoice saved successfully... you can add products now")
				// setData(emptyData)
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				openNoticeBox("Notice", "Invoice created successfully")
				setInvoiceId(response.data.id)
				// setData(emptyData)
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
			'contact_id': clientValue.id,
			'date': newDate,
			'due_date': newDueDate,
			'profesional_id': profesionalValue.id,
			'invoice': `FACT-${invoiceValue.replace('FACT-', '')}`,
			'dct': dctValue,
			'tax': taxValue,
			'body_note': bodyNoteValue,
			'foot_note': footNoteValue
		}
		if (invoiceId === 0) {
			addData(values)
			// resetForm()		
		}
		if (invoiceId > 0) {
			values.id = invoiceId
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
							Invoice Id: {invoiceId ? invoiceId : 0}
						</Typography>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="invoice"
							label="Invoice"
							name="invoice"
							onChange={event => setInvoiceValue(event.target.value)}
							value={invoiceValue}
						/>
						<Autocomplete
							id="client"
							// value={value}
							options={clientData}
							getOptionLabel={(option) => option.name ? option.name : "-"}
							onChange={(event, newValue) => {
								setClientValue(newValue);
							}}
							inputValue={clientInputValue}
							onInputChange={(event, newInputValue) => {
								setClientInputValue(newInputValue);
							}}

							value={clientValue ? clientValue : ""}
							renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
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
							label="Profesional"
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
							renderInput={(params) => <TextField {...params} label="Employee" variant="outlined" />}
							style={{ marginTop: '7px' }}
							getOptionSelected={(option, value) => option.value === value.value}


						/>					
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="body_note"
							label="Body Note"
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
							label="Foot Note"
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
							label="Discount"
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
							label="Tax"
							name="tax"
							onChange={event => setTaxValue(event.target.value)}
							value={taxValue}
							style={{ marginTop: '-2px' }}
						/>
					</Grid>
					<Grid item xs={8}>
						<DetailTable
							invoiceId={invoiceId}
							setInvoiceId={setInvoiceId}
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
							{invoiceId === 0 ? t("save_form_button") : t("update_form_button")}

						</Button>
					</Grid>
				</Grid>
			</form>
			<Box mt={8}>

			</Box>

		</Paper>
	)
})

export default InvoiceForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
