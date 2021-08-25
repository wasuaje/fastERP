import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
const endpoint = `${base_url}/cash`
const DATE_FORMAT = 'yyyy-MM-dd';

const CashForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	const { idToUpdate } = props;
	const [cashId, setCashId] = useState(props.idToUpdate)
	useEffect(() => {
		let isActive = true;
		return () => { isActive = false };
	}, [cashId, setCashId]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [dateOpenedValue, setDateOpenedValue] = useState("");
	const [dateClosedValue, setDateClosedValue] = useState("");
	const [amountOpenValue, setAmountOpenValue] = useState("");
	const [amountCloseValue, setAmountCloseValue] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");
	const [isClosed, setIsClosed] = useState(false);
	const handleChecked = (event) => {
		setIsClosed(event.target.checked);
	};

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
				setCashId(response.data.id)
				setSelectedDate(parseISO(response.data.date))
				setAmountCloseValue(response.data.amount_close)
				setAmountOpenValue(response.data.amount_open)
				setDescriptionValue(response.data.description)
				setDateClosedValue(parseISO(response.data.date_closed))
				setDateOpenedValue(parseISO(response.data.date_opened))
				setIsClosed(response.data.status == 1 ? true : false)						

			})
			.catch(e => {
				console.log(e)
				if (e.response.status !== 404) {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
				} else {
					// setData({})
					console.log("Unexpected error: ", e)
				}

			});
	}

	const updateData = (values) => {
		DataService.update(endpoint, values)
			.then(response => {
				openNoticeBox("Notice", t("record_updated_successfully", { "table": t("cash_table_title") }))
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}

	const addData = (values) => {
		DataService.create(`${endpoint}/`, values)
			.then(response => {
				openNoticeBox("Notice", t("record_created_successfully", { "table": t("cash_table_title") }))
				setCashId(response.data.id)

			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}

	const submitForm = (event) => {
		event.preventDefault();
		var newDate, newDueDate = ""
		newDate = format(selectedDate, DATE_FORMAT)

		let values = {
			'date': newDate,
			'amount_open': amountOpenValue,
			'description': descriptionValue,
		}		
		if (cashId === 0) {
			addData(values)
		}
		if (cashId > 0) {
			values.id = cashId
			values.status=isClosed
			values.amount_close=amountCloseValue
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
							{t("cash_form_cash_id")}: {cashId ? cashId : 0}
						</Typography>
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
							id="amount_open"
							label={t("cash_form_lbl_cash_amount_open")}
							name="amount_open"
							onChange={event => setAmountOpenValue(event.target.value)}
							value={amountOpenValue}
							style={{ marginTop: '5px' }}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="description"
							label={t("cash_form_lbl_cash_description")}
							name="description"
							multiline
							maxRows={4}
							onChange={event => setDescriptionValue(event.target.value)}
							value={descriptionValue}
							style={{ marginTop: '-2px' }}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="date_opened"
							label={t("cash_form_lbl_cash_date_opened")}
							name="date_opened"
							// onChange={event => setFootNoteValue(event.target.value)}
							value={dateOpenedValue}
							style={{ marginTop: '-2px' }}
							disabled={true}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="amount_close"
							label={t("cash_form_lbl_cash_amount_close")}
							name="amount_close"
							multiline
							maxRows={4}
							onChange={event => setAmountCloseValue(event.target.value)}
							value={amountCloseValue}
							style={{ marginTop: '5px' }}
							disabled={cashId === 0 ? true : false}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="date_closed"
							label={t("cash_form_lbl_cash_date_closed")}
							name="date_closed"
							// onChange={event => setFootNoteValue(event.target.value)}
							value={dateClosedValue}
							style={{ marginTop: '-2px' }}
							disabled={true}
						/>
						<FormControlLabel
							value={isClosed}
							checked={isClosed}
							control={<Checkbox color="primary" /> }
							label={isClosed ? t("cash_form_lbl_invoice_is_closed"): t("cash_form_lbl_invoice_to_close")}
							labelPlacement="end"
							onChange={handleChecked}
							name="is_closed"
							disabled={cashId === 0 ? true: false}
						/>
					</Grid>
					<Grid item xs={8}>
						<DetailTable
							cashId={cashId}
							setCashId={setCashId}
							amountOpenValue={amountOpenValue}
							amountCloseValue={amountCloseValue}
							setAmountOpenValue={setAmountOpenValue}
							setAmountCloseValue={setAmountCloseValue}
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
							{cashId === 0 ? t("save_form_button") : t("update_form_button")}

						</Button>
					</Grid>
				</Grid>
			</form>
			<Box mt={8}>

			</Box>

		</Paper>
	)
})

export default CashForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
