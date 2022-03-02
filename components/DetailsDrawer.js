import * as React from 'react';
import {styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import {Autocomplete,TextField,Stack,Chip, Typography} from '@mui/material';
import { drawerWidth, mobileDrawerWidth } from '../lib/utils'
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { makeStyles } from '@mui/styles';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getIcon } from '../lib/utils';

const SidebarDiv=styled('div')(({theme}) => ({
    display: 'flex',
    // alignItems: 'center',
    padding: theme.spacing(0,0,1,1),
}));

const DrawerHeader=styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0,1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

const useStyles = makeStyles(() => ({
    info_icon: {
        marginRight: `8px`
    },
    total_count: {
        paddingBottom: `0px`
    },
    active_title: {
        paddingBottom: `0px`
    }
}));



export default function AppDrawer(props) {
    const defaultProps={
        options: props.state_info.length? props.state_info.map(state => state.state):[],
        getOptionLabel: (option) => option,
    };

    const theme = useTheme();

    const classes = useStyles();

    const timeConverter = (UNIX_timestamp) => {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.open}
        >
            <DrawerHeader>
                <Autocomplete
                    {...defaultProps}
                    id="select-on-focus"
                    selectOnFocus
                    fullWidth
                    renderInput={(params) => (
                        <TextField {...params} label="Search by state" variant="standard" />
                    )}
                    value={props.value}
                    onChange={(event,value) => {
                        props.handleValueChange(value)
                    }}
                />
                <IconButton style={{marginLeft: theme.spacing(1)}} onClick={props.handleDrawerClose}>
                    {theme.direction==='ltr'? <ChevronLeftIcon />:<ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            {props.value&&<SidebarDiv>
                <Stack direction="row" spacing={1}>
                    <Chip
                        label={props.value}
                        onClick={props.handleClick}
                        onDelete={props.handleDelete}
                        color="primary"
                        variant="outlined"
                    />
                </Stack>
            </SidebarDiv>}
            <SidebarDiv className={classes.active_title}>
                <Typography variant="h6" gutterBottom component="div">
                    {`${props.country_title.length? props.country_title:'US'} Total Cases`}
                </Typography>
            </SidebarDiv>
            <SidebarDiv className={classes.total_count}>
                <Typography variant="h4" gutterBottom component="div">
                    {new Intl.NumberFormat().format(props.covid_info.cases)}
                </Typography>
            </SidebarDiv>

            <SidebarDiv>
                <TipsAndUpdatesIcon className={classes.info_icon} />
                <Typography variant="caption" display="block" gutterBottom>
                    {`Last updated: ${timeConverter(props.covid_info.updated)}`}
                </Typography>
            </SidebarDiv>
            <Divider />
            <List>
                {['tested','active','recovered','deaths','today\'s cases'].map((text,index) => (
                    <ListItem key={text}>
                        <ListItemIcon>
                            {getIcon(text)}
                        </ListItemIcon>
                        <ListItemText primary={text.toUpperCase()} secondary={new Intl.NumberFormat().format(props.covid_info[text])} />

                    </ListItem>
                ))}
            </List>
            <Divider />
        </Drawer>
    )
}