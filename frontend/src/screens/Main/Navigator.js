import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import { useTranslation } from "react-i18next";
import PeopleIcon from '@material-ui/icons/People';
import Category from '@material-ui/icons/Category';
import LockOpen from '@material-ui/icons/LockOpen';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DataService from "../../services/data.service";

import Authenticate from '../Authenticate/Authenticate';
import { Receipt, Shop } from '@material-ui/icons';
import InvoiceTable from '../Invoice/InvoiceTable';
import ProductCategoryTable from '../ProductCategory/ProductCategoryTable';
import ProductTable from '../Product/ProductTable';
import ClientTable from '../Client/ClientTable';
import PurchaseTable from '../Purchase/PurchaseTable';
import ProviderTable from '../Provider/ProviderTable';
import PaymentMethod from '../PaymentMethod/PaymentMethodTable';
import CollectTable from '../Collect/CollectTable';
import ClientDocumentTable from '../ClientDocument/ClientDocumentTable'
import CashTable from '../Cash/CashTable';
import InventoryTable from '../Inventory/InventoryTable';
import ReportForm from '../../components/Report/ReportForm'
import logo from '../../assets/img/logo.jpg'; // Tell webpack this JS file uses this image



const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },  
});

const ChildItem = (props) => {
  const { classes, key, icon, title, component, setContentComponent, setheaderTitle } = props
  const [active, setActive] = useState(false);

  return (
    <ListItem
      key={key}
      button
      className={clsx(classes.item)}
      onClick={() => {
        setheaderTitle(title)
        setContentComponent(component)
        setActive(true)

      }
      }
    >
      <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
      <ListItemText classes={{ primary: classes.itemPrimary, }}>
        {title}
      </ListItemText>
    </ListItem>
  )
}

const base_url = 'api'
const endpoint = `${base_url}/configuration`

function Navigator(props) {
  const { classes, categories, setCategories, handleOptClick, setCategoriesNew, setContentComponent, setheaderTitle, ...other } = props;
  const { t } = useTranslation();

  	// Getting config data only once at the beggining
	const [configData, setConfigData] = useState({});
	useEffect(() => {

		retrieveConfigData()
	}, []); 

	const retrieveConfigData = () => {
		DataService.getAll(endpoint)
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
				alert(`Error - Code: ${e.response.status} Message: ${e.response.statusText}`)
			});
	}

  // newCategories[0].children[3].active=true

  // console.log("NC",newCategories)  


  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>          
          <Avatar alt="" src={logo} className={styles.large} />
          {configData.company_name}
        </ListItem>
        
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Menu
          </ListItemText>
        </ListItem>
        <ListItem className={classes.categoryHeader}>
          <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }} >
            {t("menu_process")}
          </ListItemText>
        </ListItem>
        <ChildItem
          key="authenticate"
          setContentComponent={setContentComponent}
          active={true}
          setheaderTitle={setheaderTitle}
          icon={<LockOpen />}
          component={<Authenticate />}
          title={t("menu_authenticate")}
          classes={classes}
        />
        <Divider className={classes.divider} />
        <ListItem className={classes.categoryHeader}>
          <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }} >
            {t("menu_sales")}
          </ListItemText>
        </ListItem>
        <ChildItem
          key="invoice"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Receipt />}
          component={<InvoiceTable />}
          title={t("menu_invoice")}
          classes={classes}
        />
        <ChildItem
          key="collect"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Receipt />}
          component={<CollectTable />}
          title={t("menu_collect")}
          classes={classes}
        />        
        <ChildItem
          key="client_documents"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Receipt />}
          component={<ClientDocumentTable />}
          title={t("menu_client_document")}
          classes={classes}
        />        
        <ChildItem
          key="client"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<SupervisorAccountIcon />}
          component={<ClientTable />}
          title={t("menu_client")}
          classes={classes}
        />

        <Divider className={classes.divider} />
        <ListItem className={classes.categoryHeader}>
              <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }} >
                {t("menu_purchases")}
              </ListItemText>
        </ListItem>
        <ChildItem
          key="purchase"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Shop />}
          component={<PurchaseTable />}
          title={t("menu_purchase")}
          classes={classes}
        />        
        <ChildItem
          key="provider"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<SupervisorAccountIcon />}
          component={<ProviderTable />}
          title={t("menu_provider")}
          classes={classes}
        />
        <Divider className={classes.divider} />
        <ListItem className={classes.categoryHeader}>
              <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }} >
                {t("menu_inventory")}
              </ListItemText>
        </ListItem>
        <ChildItem
          key="inventory_move"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Shop />}
          component={<InventoryTable />}
          title={t("menu_inventory_move")}
          classes={classes}
        />        
        <ChildItem
          key="product_category"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Category />}
          component={<ProductCategoryTable />}
          title={t("menu_product_category")}
          classes={classes}
        />
        <ChildItem
          key="product"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<PostAddIcon />}
          component={<ProductTable />}
          title={t("menu_product")}
          classes={classes}
        />
          <ChildItem
          key="inventory_report"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<AssessmentIcon />}
          component={<ReportForm  reportGroup="inventory"/>}
          title={t("menu_report")}
          classes={classes}
        />
        <Divider className={classes.divider} />
        <ListItem className={classes.categoryHeader}>
              <ListItemText classes={{ primary: classes.categoryHeaderPrimary, }} >
                {t("menu_cash")}
              </ListItemText>
        </ListItem>
        <ChildItem
          key="cash_move"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Shop />}
          component={<CashTable />}
          title={t("menu_cash_move")}
          classes={classes}
        />        
        <ChildItem
          key="payment_methods"
          setContentComponent={setContentComponent}
          setheaderTitle={setheaderTitle}
          icon={<Category />}
          component={<PaymentMethod />}
          title={t("menu_payment_method")}
          classes={classes}
        />        
        <Divider className={classes.divider} />        
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);