import React,  { useState }  from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider, withStyles } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Authenticate from '../Authenticate/Authenticate';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import Navigator from './Navigator';
import Header from './Header';
import ClientTable from '../Client/ClientTable';
import InvoiceTable from '../Invoice/InvoiceTable';
import { useTranslation } from "react-i18next";
import i18n from "../../translations/i18n";



function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">        
        {t("main_website")}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

let theme = createMuiTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

const drawerWidth = 256;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: theme.spacing(6, 4),
    background: '#eaeff1',
  },
  footer: {
    padding: theme.spacing(2),
    background: '#eaeff1',
  },
};

function Main(props) {
  const { classes } = props;
  const [language, setLanguage] = useState('es');
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ContentComponent, setContentComponent] = useState(<Authenticate /> );
  const [headerTitle, setheaderTitle] = useState("");
  const [categories, setCategories] = useState([
    {
      id: t("menu_process"),
      children: [
        { id: t('menu_authenticate'), icon: <PeopleIcon />, active: true, component: <Authenticate /> },        
        { id: t('menu_invoice'), icon: <DnsRoundedIcon /> , component: <InvoiceTable PaperProps={{ style: { width: drawerWidth } }}/>},
        { id: t('menu_purchase'), icon: <PermMediaOutlinedIcon /> },
        { id: t('menu_cash'), icon: <PublicIcon /> },
        { id: t('menu_inventory'), icon: <PublicIcon /> },
      ],
    },
    {
      id: t("menu_tables"),
      children: [
        { id: t('menu_client'), icon:  <PeopleIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},
        { id: t('menu_provider'), icon: <SettingsIcon /> },
        { id: t('menu_product_category'), icon: <TimerIcon /> },
        { id: t('menu_product'), icon: <PhonelinkSetupIcon /> },
        { id: t('menu_employee'), icon: <PhonelinkSetupIcon /> },
      ],
    },
    {
      id: t("menu_report"),
      children: [
        { id: t('menu_report_sales'), icon: <DnsRoundedIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},
        { id: t('menu_report_purchase'), icon: <SettingsIcon /> },
        { id: t('menu_report_cash'), icon: <TimerIcon /> },        
        { id: t('menu_report_inventory'), icon: <TimerIcon /> },        
      ],
    },
    {
      id: t("menu_setting"),
      children: [
        { id:  t('menu_settings'), icon:  <SettingsIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},        
        { id:  t('menu_users'), icon:  <SettingsIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},        
        { id:  t('menu_permissions'), icon:  <SettingsIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},        
      ],
    },
  ])
  
  const handleOnLanguageChangeClick=(e)=>{
    e.preventDefault();
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
  }

  function handleOptClick(id, childId){    
    let newCategories  = [
      ...categories
    ];
    
  
  setCategories( () => {
    //clean actives
    for (var i = 0; i < newCategories.length; i++) {
      if (newCategories[i].id === id) {        
        for (var j = 0; j < newCategories[i].children.length; j++) {                  
          delete  newCategories[i].children[j]["active"];
          }          
        }                
      } 
  // set new active
    for (var ii = 0; ii < newCategories.length; ii++) {
      if (newCategories[ii].id === id) {        
        for (var jj = 0; jj < newCategories[ii].children.length; jj++) {          
          if (newCategories[ii].children[jj].id === childId) {            
              newCategories[ii].children[jj].active=true                            
              setContentComponent(newCategories[ii].children[jj].component)
              setheaderTitle(newCategories[ii].children[jj].id)
            break;
          }          
        }                
      }
    }
    return newCategories
    })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }}
                      categories={categories}
                      setCategories={setCategories}
                      handleOptClick={handleOptClick}

             />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header 
            title={headerTitle}
            onDrawerToggle={handleDrawerToggle} 
            language={language}            
            handleOnLanguageChangeClick={handleOnLanguageChangeClick}
            />
          <main className={classes.main}>
            {ContentComponent }
          </main>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);