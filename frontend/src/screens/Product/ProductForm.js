import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
	code: yup
		.string('Enter product code')
		.required('Code is required')
		.min(2, 'Code should be of minimum 2 characters length'),			
	name: yup
		.string('Enter category name')
		.required('Name is required')
		.min(4, 'Name should be of minimum 4 characters length'),			
	format: yup
		.string('Enter product format')
		.required('Format is required')
		.min(4, 'Format should be of minimum 4 characters length'),			
	price: yup
		.number('Enter a price')
		.required('Price is required')
		.positive('Only positive values')
		.moreThan(0, 'Prices cannot be 0'),			
	cost: yup
		.number('Enter a cost')
		.required('Cost is required')
		.positive('Only positive values')
		.moreThan(0, 'Costs cannot be 0'),			
	dct: yup
		.number('Enter a discount'),			
	tax: yup
		.number('Enter a tax'),		
	barcode: yup
		.string('Enter barcode'),
	stock: yup
		.number('Enter a stock')
		.required('Stock is required')
		.positive('Only positive values')
		.integer('Only integer positive values'),			
	category_id: yup
		.string('Enter category name')		
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
const categoryEndpoint = `${base_url}/product-category`
const endpoint = `${base_url}/product`


const ProductCategoryForm = React.forwardRef((props, ref) => {
	const { t } = useTranslation();

	const { idToUpdate } = props;
	
	// Getting Category data only once at the beggining
	const [categoryData, setCategoryData] = useState([]);
	useEffect(() => {

		retrieveCategoryData()
	}, []); // Those ARE connectec

	const retrieveCategoryData = () => {
		DataService.getAll(categoryEndpoint)
			.then(response => {
				setCategoryData(response.data)
				// console.log(response.data);
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const [categoryValue, setCategoryValue] = React.useState(categoryData[0]);
	const [categoryInputValue, setCategoryInputValue] = React.useState('');

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
		'code': '',
		'name': '',
		'price': '',
		'stock': '',
		'format': '',
		'cost': 0.00,
		'dct': 0.0,
		'tax': 0.0,
		'category_id': '',
		'bar_code': ''		
	}

	const [data, setData] = useState(emptyData);
	useEffect(() => {
		let id = typeof idToUpdate === 'object' ? 0 : idToUpdate
		getData(id)
	}, []);

	const getData = (id) => {
		DataService.get(id, endpoint)
			.then(response => {
				// console.log("data get",response.data)			
				setData(response.data)
				setCategoryValue(response.data.category)
			})
			.catch(e => {
				if (e.response.status != '404') {
					openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
					// setData(emptyData)
				} else {
					setData(emptyData)
				}

			});
	}

	const updateData = (values) => {
		values.category_id=categoryValue.id
		DataService.update(endpoint, values)		
			.then(response => {
				openNoticeBox("Notice", t("record_updated_successfully", {"table": t("product_table_title")}))
				setData(emptyData)				
			})
			.catch(e => {
				openNoticeBox("Error", `Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

	const addData = (values) => {
		values.category_id=categoryValue.id
		// console.log(values)
		DataService.create(endpoint, values)
			.then(response => {
				openNoticeBox("Notice", t("record_created_successfully", {"table": t("product_table_title")}))
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
						<Autocomplete
							id="category_id"
							name= "category_id"
							// value={value}
							options={categoryData}
							getOptionLabel={(option) => option.name ? option.name : "-"}
							onChange={(event, newValue) => {
								setCategoryValue(newValue);
							}}
							inputValue={categoryInputValue}
							onInputChange={(event, newInputValue) => {
								setCategoryInputValue(newInputValue);
							}}

							value={categoryValue ? categoryValue : ""}
							renderInput={(params) => <TextField {...params} label={t("product_form_lbl_category")} variant="outlined" />}
							getOptionSelected={(option, value) => option.value === value.value}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="code"
							label={t("product_form_lbl_prod_code")}
							name="code"
							value={formik.values.code}
							onChange={formik.handleChange}
							error={formik.touched.code && Boolean(formik.errors.code)}
							helperText={formik.touched.code && formik.errors.code}
							style={{ marginTop: '-1px' }}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="name"
							label={t("product_form_lbl_prod_name")}
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
							id="format"
							label={t("product_form_lbl_prod_format")}
							name="format"
							value={formik.values.format}
							onChange={formik.handleChange}
							error={formik.touched.format && Boolean(formik.errors.format)}
							helperText={formik.touched.format && formik.errors.format}							
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="price"
							label={t("product_form_lbl_prod_price")}
							name="price"
							type= "number"
							value={formik.values.price}
							onChange={formik.handleChange}
							error={formik.touched.price && Boolean(formik.errors.price)}
							helperText={formik.touched.price && formik.errors.price}							
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="dct"
							label={t("product_form_lbl_dct")}
							name="dct"
							type= "number"
							value={formik.values.dct}
							onChange={formik.handleChange}
							error={formik.touched.dct && Boolean(formik.errors.dct)}
							helperText={formik.touched.dct && formik.errors.dct}							
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="tax"
							label={t("product_form_lbl_tax")}
							name="tax"
							type= "number"
							value={formik.values.tax}
							onChange={formik.handleChange}
							error={formik.touched.tax && Boolean(formik.errors.tax)}
							helperText={formik.touched.tax && formik.errors.tax}							
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="cost"
							label={t("product_form_lbl_cost")}
							name="cost"
							type= "number"
							value={formik.values.cost}
							onChange={formik.handleChange}
							error={formik.touched.cost && Boolean(formik.errors.cost)}
							helperText={formik.touched.cost && formik.errors.cost}							
						/>
					</Grid>
					<Grid item xs={8}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="bar_code"
							label={t("product_form_lbl_barcode")}
							name="bar_code"
							value={formik.values.bar_code}
							onChange={formik.handleChange}
							error={formik.touched.bar_code && Boolean(formik.errors.bar_code)}
							helperText={formik.touched.bar_code && formik.errors.bar_code}							
						/>
					</Grid>					
					<Grid item xs={4}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="stock"
							label={t("product_form_lbl_stock")}
							name="stock"
							type= "number"
							value={formik.values.stock}
							onChange={formik.handleChange}
							error={formik.touched.stock && Boolean(formik.errors.stock)}
							helperText={formik.touched.stock && formik.errors.stock}							
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
