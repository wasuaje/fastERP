import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie'
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
import Container from '@material-ui/core/Container';
import DataService from "../../services/data.service";
import { useTranslation } from "react-i18next";


const validationSchema = yup.object({
    username: yup
        .string('Enter your username')        
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const getAccessToken = () => Cookies.get('access_token')
    function Error(message) {
        this.message = message;
        this.name = 'UserException';
}

// const base_url = 'api'
const endpoint = 'token'

const Authenticate = () => {
    const [userName,setUsername] = useState("")
    const [password,setPassword] = useState("")
    
    const { t } = useTranslation();

    const handleAuthClick = (payload) => {
        if (!getAccessToken()) {            
            const tokens = DataService.login(endpoint, payload)
                .then(data => {
                    // console.log("token:", typeof data, data.data.access_token)
                    const expires = (tokens.expires_in || 180 * 60) * 1000
                    const inOneHour = new Date(new Date().getTime() + expires)

                    // you will have the exact same setters in your Login page/app too
                    Cookies.set('access_token', data.data.access_token, { expires: inOneHour })                    
                    window.location.replace(
                        `${window.location.href}`
                    )
                })
                .catch(err => {                    
                    console.log("Error getting token: ", err.response)
                    // setOpen(true)
                })
        }
}

    const formik = useFormik({
        initialValues: {
            username: userName,
            password: password,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            handleAuthClick(values);
        },
    });
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {t("login_login")}
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"                        
                        fullWidth
                        id="username"
                        label={t("login_username")}
                        name="username"                                                
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"                        
                        fullWidth
                        name="password"
                        label={t("login_password")}
                        type="password"
                        id="password"                        
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label={t("login_remember_me")}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}                        
                    >
                        {t("login_login")}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                {t("login_forgot_pass")}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                { t("login_noaccount") }
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                
            </Box>
        </Container>
    )
}

    export default Authenticate;
    // ReactDOM.render(<Authenticate />, document.getElementById('root'));
