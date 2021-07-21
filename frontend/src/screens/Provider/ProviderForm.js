import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import GenericDialogBox from '../../components/GenericDialogBox';
import InfoBox from '../../components/InfoBox';
import DataService from "../../services/data.service";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object().shape({
	name: yup
		.string('Enter provider name')
		.required('Name is required')
		.min(4, 'Names should be of minimum 4 characters length'),
	phone: yup
		.string('Enter provider phone')
		.required('Phone is required')
		.min(8, 'Phone should be of minimum 8 characters length'),
	email: yup
		.string('Enter your email')
		.email('Enter a valid email')
		.required('Email is required'),
	website: yup
		.string('Only strings allowed'),		
	cuit: yup
		.string('Enter your cuit'),		
	address: yup
		.string('Address')
		.min(10, 'Address should be of minimum 10 characters length'),
	state: yup
		.string('State')
		.min(5, 'State should be of minimum 5 characters length'),
	city: yup
		.string('City')
		.min(5, 'City should be of minimum 5 characters length'),
	zip: yup
		.string('Zip Code')
		.min(4, 'Zip Code should be of minimum 4 characters length')
});


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
const endpoint = `${base_url}/provider`


const ProviderForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();
	
	const { idToUpdate } = props;

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
		'website': '',		
		'address': '',
		'state': '',
		'city': '',
		'zip': '',
		'cuit':''
	}
		
	const [data, setData] = useState(emptyData);
	useEffect(() => {
		let id = typeof idToUpdate === 'object' ? 0 :idToUpdate
		getData(id)
	}, []); 

	const getData = (id) => {      		
		DataService.get(id, endpoint)
		  .then(response => {        			
			// console.log("data get",response.data)			
			setData(response.data)			
		  })
		  .catch(e => {  
			if (e.response.status != '404') {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   
				// setData(emptyData)
			}else{
				setData(emptyData)
			}
				
		  });            
	  }  

	  const updateData = (values) => {      		  
		DataService.update(endpoint, values)
		  .then(response => {        			
			openNoticeBox("Notice", t("record_updated_successfully", {"table": t("provider_table_title")}))
			setData(emptyData)
		  })
		  .catch(e => {  			  
			openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`) 
		  });            
	  }  	  

	  const addData = (values) => {      		  
		DataService.create(endpoint, values)
		  .then(response => {        			
			openNoticeBox("Notice", t("record_created_successfully", {"table": t("provider_table_title")}))
			setData(emptyData)
		  })
		  .catch(e => {  			  
			openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)   							
		  });            
	  }  	  
	
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: data,
		validationSchema: validationSchema,
		onReset: () => {			
		},
		onSubmit: (values, { setSubmitting, setErrors, setStatus, resetForm }) => {			
			if (typeof idToUpdate === 'object') {
				addData(values)		
				resetForm()		
			}
			if (typeof idToUpdate === 'number') {
				// console.log("submit update",values)				
				values.id = idToUpdate
				updateData(values)
			}

		},
	});
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

			<form className={classes.form} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
				<Grid container spacing={1}>

					<Grid item xs={6}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="name"
							label={t("provider_form_lbl_provider_name")}
							name="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={formik.touched.name && Boolean(formik.errors.name)}
							helperText={formik.touched.name && formik.errors.name}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="phone"
							label={t("provider_form_lbl_provider_phone")}
							name="phone"
							value={formik.values.phone}
							onChange={formik.handleChange}
							error={formik.touched.phone && Boolean(formik.errors.phone)}
							helperText={formik.touched.phone && formik.errors.phone}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="email"
							label={t("provider_form_lbl_provider_email")}
							name="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="website"
							label={t("provider_form_lbl_provider_website")}
							name="website"
							value={formik.values.website}
							onChange={formik.handleChange}
							error={formik.touched.website && Boolean(formik.errors.website)}
							helperText={formik.touched.website && formik.errors.website}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="cuit"
							label={t("provider_form_lbl_provider_dnicuil")}
							name="cuit"
							value={formik.values.cuit}
							onChange={formik.handleChange}
							error={formik.touched.cuit && Boolean(formik.errors.cuit)}
							helperText={formik.touched.cuit && formik.errors.cuit}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="address"
							label={t("provider_form_lbl_provider_address")}
							name="address"
							value={formik.values.address}
							onChange={formik.handleChange}
							error={formik.touched.address && Boolean(formik.errors.address)}
							helperText={formik.touched.address && formik.errors.address}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="state"
							label={t("provider_form_lbl_provider_state")}
							name="state"
							value={formik.values.state}
							onChange={formik.handleChange}
							error={formik.touched.state && Boolean(formik.errors.state)}
							helperText={formik.touched.state && formik.errors.state}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="city"
							label={t("provider_form_lbl_provider_city")}
							name="city"
							value={formik.values.city}
							onChange={formik.handleChange}
							error={formik.touched.city && Boolean(formik.errors.city)}
							helperText={formik.touched.city && formik.errors.city}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="zip"
							label={t("provider_form_lbl_provider_zip")}
							name="zip"
							value={formik.values.zip}
							onChange={formik.handleChange}
							error={formik.touched.zip && Boolean(formik.errors.zip)}
							helperText={formik.touched.zip && formik.errors.zip}
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
							{typeof idToUpdate === 'object' ? t("save_form_button") : t("update_form_button")}
						</Button>
					</Grid>
					
				</Grid>
			</form>

			<Box mt={8}>

			</Box>
		</Paper>
	)
})

export default ProviderForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
