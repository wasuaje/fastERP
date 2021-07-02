import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useDataApi from "../apiHook"
import GenericDialogBox from '../components/GenericDialogBox';
import InfoBox from '../components/InfoBox';

const validationSchema = yup.object({
    name: yup
        .string('Enter client name')
        .required('Name is required')
        .min(4, 'Names should be of minimum 4 characters length'),
    phone: yup
        .string('Enter client phone')
        .required('Phone is required')
        .min(8, 'Phone should be of minimum 8 characters length'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    age: yup
        .number('Only number allowed')
        .positive()
        .moreThan(17, 'You should have more than 18')
				.lessThan(90, "Are you sure you are more than 90?")
        .integer(),
    gender: yup
        .string('Enter your gender')
        .matches('[F|M|X]', 'Only M,F or X allowed')
        .uppercase()
        .max(1, 'Only M,F or X allowed'),
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
        backgroundColor: 'white',

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



const ClientForm = React.forwardRef((props, ref) => {

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
        doFetch(new Date().getTime())
        setInfoOpen(false)
    };
    // *****************


    const [{ data, isLoading, isError }, doFetch] = useDataApi(
        'client/'+idToUpdate,
        'get',
        {},
        'yes',
        [],
    );

    const [{ dataPost, isLoadingPost, isErrorPost }, refreshPost, saveFormData] = useDataApi(
        'client',
        'post',
        {},
        'post',
        [],
    );

    const [{ dataUpdate, isLoadingUpdate, isErrorUpdate }, refreshUpdate, updateFormData] = useDataApi(
        'client',
        'patch',
        {},
        'update',
        [],
    );

    const formik = useFormik({				
				enableReinitialize: true,
        initialValues: data,
        validationSchema: validationSchema,
        onReset: ({ }) => {
            doFetch({})
        },
        onSubmit: (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
            // console.log(values) 
            if (data.id == null){
                saveFormData(values)
                if (!isErrorPost) openDialogBox("Notice", "Client added successfully")
                resetForm({})
            }
						if (data.id > 0){
							values.id = data.id
							updateFormData(values)
							if (!isErrorPost) openDialogBox("Notice", "Client updated successfully")							
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
            <div className={classes.form}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="name"
                                label="Client Name"
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
                                label="Phone Number"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="gender"
                                label="Gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                helperText={formik.touched.gender && formik.errors.gender}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="age"
                                label="Age"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="address"
                                label="Address"
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
                                label="State"
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
                                label="City"
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
                                label="Zip"
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
                                {data.id == null ? 'Save' : 'Update'}
                            </Button>
                        </Grid>

                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>

            </Box>
        </Paper>
    )
})

export default ClientForm;
    // ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
