import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { parseISO, format } from 'date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import GenericDialogBox from '../GenericDialogBox';
import InfoBox from '../InfoBox';
import DataService from "../../services/data.service";
import DetailTable from '../../screens/Inventory/DetailTable';
import { useTranslation } from "react-i18next";
import { alpha } from '@material-ui/core/styles';
//Start report importing
import ValorizedPrint from './Inventory/ValorizedPrint'


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
// const endpoint = `${base_url}/inventory`
const productEndpoint = `${base_url}/product`
const configEndpoint = `${base_url}/configuration`
const DATE_FORMAT = 'yyyy-MM-dd';

const ReportForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	const { reportGroup } = props;

	/////////////// REPORT DATA ///////////////////
	const reportData = {
		inventory: [
			{
				title: t("report_inventory_valorized_title"),
				component: ValorizedPrint,
				endpoint: 'api/inventory/report-valorized'
			},
			{
				title: t("report_inventory_valorized_title2"),
				component: ValorizedPrint,
				endpoint: 'api/inventory/report-valorized'
			},
		]
	}

	const [configData, setConfigData] = useState({});
	useEffect(() => {

		retrieveConfigData()
	}, []); 

	const retrieveConfigData = () => {
		DataService.getAll(configEndpoint)
			.then(response => {
        let configTemp = {};
        response.data.forEach(cfg => {
          configTemp[cfg.config_name] = cfg.config_value          
        });

				setConfigData(configTemp)
				// console.log(configTemp);      
			})
			.catch(e => {
        console.log(e)
				alert(`Error - Code: ${e.response.status} Message: ${e.response.statusText} - ${e.response.data.detail}`)
			});
	}

	const [fromDate, setFromDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [toData, setToData] = useState("");
	const [fromData, setFromData] = useState("");
	const [selectedReport, setSelectedReport] = useState("");
	const [selectedReportValue, setSelectedReportValue] = useState("");

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

		getData(selectedReport.endpoint)
	}, [selectedReport]); 

	const getData = (endpoint) => {
		DataService.getAll(endpoint)
			.then(response => {
				// console.log("get data",response.data)		
				setData(response.data)
				// setInventoryId(response.data.id)
				// setFromDate(parseISO(response.data.date))				
				// setDescriptionValue(response.data.description)								
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


	const submitForm = (event) => {
		event.preventDefault();
		
		var newDate, newDueDate = ""
		newDate = format(fromDate, DATE_FORMAT)

		let values = {
			'date': newDate,
			'description': selectedReport,
			'description2': selectedReportValue,
		}
		// console.log(selectedReport.endpoint)
		const test = getData(selectedReport.endpoint);
	
		selectedReport.component(data, configData)
		

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
					<Grid item xs={12}>
						<Autocomplete
							id="report_type"
							// value={value}
							options={reportData[reportGroup]}
							getOptionLabel={(option) => option.title ? option.title : "-"}
							onChange={(event, newValue) => {								
								event.preventDefault()
								setSelectedReport(newValue);								
							}}
							inputValue={selectedReportValue}
							onInputChange={(event, newInputValue) => {																
								setSelectedReportValue(newInputValue);
							}}

							value={selectedReport ? selectedReport : ""}
							renderInput={(params) => <TextField {...params} label={t("report_form_detail_lbl_selected_report")} />}
							getOptionSelected={(option, value) => option.value === value.value}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="h6">
							{t("report_form_lbl_date_from")}
						</Typography>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								clearable="true"
								value={fromDate}
								placeholder="2021-07-07"
								onChange={date => setFromDate(date)}
								// minDate={new Date()}
								format={DATE_FORMAT}
								autoOk
								name="from_date"
								id="from_date"
								variant="inline"
								inputVariant="outlined"
								style={{ marginTop: '5px' }}
							/>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="h6">
							{t("report_form_lbl_date_to")}
						</Typography>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								clearable="true"
								value={toDate}
								placeholder="2021-07-07"
								onChange={date => setToDate(date)}
								// minDate={new Date()}
								format={DATE_FORMAT}
								autoOk
								name="to_date"
								id="to_date"
								variant="inline"
								inputVariant="outlined"
								style={{ marginTop: '5px' }}
							/>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="h6">
							{t("report_form_lbl_from_data")}
						</Typography>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="from_data"
							label={t("report_form_lbl_from_data")}
							name="from_data"
							onChange={event => setFromData(event.target.value)}
							value={fromData}
							style={{ marginTop: '-2px' }}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="h6">
							{t("report_form_lbl_to_data")}
						</Typography>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="to_data"
							label={t("report_form_lbl_to_data")}
							name="to_data"
							onChange={event => setToData(event.target.value)}
							value={toData}
							style={{ marginTop: '-2px' }}
						/>
					</Grid>
					<Grid item xs={12}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							// onClick = {(event) => setSelectedReportValue(data, configData)}
						>
							{t("send_form_button")}

						</Button>
					</Grid>
				</Grid>
			</form>
			<Box mt={8}>

			</Box>

		</Paper>
	)
})

export default ReportForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
