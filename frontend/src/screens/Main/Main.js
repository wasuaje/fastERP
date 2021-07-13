import React,  { useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider, withStyles } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import WithMaterialUI from '../FormTest';
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
import Content from '../Content';
import Header from './Header';
import ClientTable from '../Client/ClientTable';
import InvoiceTable from '../Invoice/InvoiceTable';
import { useTranslation } from "react-i18next";
import i18n from "../../translations/i18n";
// import {i18n} from '../../translations/i18n';




function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">        
        {t("website")}
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ContentComponent, setContentComponent] = useState(<WithMaterialUI /> );
  const [headerTitle, setheaderTitle] = useState("");
  const [categories, setCategories] = useState([
    {
      id: 'Develop',
      children: [
        { id: 'Authentication', icon: <PeopleIcon />, active: true, component: <WithMaterialUI /> },
        { id: 'Clients', icon: <DnsRoundedIcon /> , component: <ClientTable PaperProps={{ style: { width: drawerWidth } }}/>},
        { id: 'Invoice', icon: <DnsRoundedIcon /> , component: <InvoiceTable PaperProps={{ style: { width: drawerWidth } }}/>},
        { id: 'Storage', icon: <PermMediaOutlinedIcon /> },
        { id: 'Hosting', icon: <PublicIcon /> },
        { id: 'Functions', icon: <SettingsEthernetIcon /> },
        { id: 'ML Kit', icon: <SettingsInputComponentIcon /> },
      ],
    },
    {
      id: 'Quality',
      children: [
        { id: 'Analytics', icon: <SettingsIcon /> },
        { id: 'Performance', icon: <TimerIcon /> },
        { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
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
    for (var i = 0; i < newCategories.length; i++) {
      if (newCategories[i].id === id) {        
        for (var j = 0; j < newCategories[i].children.length; j++) {          
          if (newCategories[i].children[j].id === childId) {            
              newCategories[i].children[j].active=true                            
              setContentComponent(newCategories[i].children[j].component)
              setheaderTitle(newCategories[i].children[j].id)
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