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
		.string('Enter category name')
		.required('Name is required')
		.min(4, 'Names should be of minimum 4 characters length'),	
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
const endpoint = `${base_url}/product-category`


const ProductCategoryForm = React.forwardRef((props, ref) => {
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
		'age': '',
		'gender': '',
		'address': '',
		'state': '',
		'city': '',
		'zip': '',
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
			openNoticeBox("Notice", "ProductCategory updated successfully")
			setData(emptyData)
		  })
		  .catch(e => {  			  
			openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`) 
		  });            
	  }  	  

	  const addData = (values) => {      		  
		DataService.create(endpoint, values)
		  .then(response => {        			
			openNoticeBox("Notice", "ProductCategory created successfully")   			
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

					<Grid item xs={12}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="name"
							label="Category Name"
							name="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={formik.touched.name && Boolean(formik.errors.name)}
							helperText={formik.touched.name && formik.errors.name}
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

export default ProductCategoryForm;
