import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material'
import { Autocomplete, TextField, Stack, Chip } from '@mui/material';
import { getStateData, getGeoCode, getCountryData, getGeoJson } from '../lib/apis'
import Map from '../components/Map';
import { getIcon } from '../lib/utils';
import Loader from '../components/Loader'

const drawerWidth = 300;
const mobileDrawerWidth = 220;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${window.screen.width > 767 ? drawerWidth : mobileDrawerWidth}px)`,
        marginLeft: `${window.screen.width > 767 ? drawerWidth : mobileDrawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

const SidebarDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    // alignItems: 'center',
    padding: theme.spacing(0, 0, 1, 1),
}));

const useStyles = makeStyles(() => ({
    title: {
        // marginBottom: `-16px`
    },
    info_icon: {
        marginRight: `8px`
    },
    total_count: {
        // marginTop: `8px`,
        paddingBottom: `0px`
    },
    active_title: {
        paddingBottom: `0px`
    }
}));

export default function Home(props) {
    console.log(props)
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [header_text, setHeaderText] = React.useState('Covid Tracker')
    const [country_title, setCountryTitle] = React.useState('')
    const [value, setValue] = React.useState(null);
    const [state_info, setStateInfo] = React.useState([])
    const [covid_info, setCovidInfo] = React.useState({})
    const [isMarkerShown, setIsMarkerShown] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [size, setSize] = React.useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        handleValueChange(null)
    };

    const classes = useStyles();

    const defaultProps = {
        options: state_info.length ? state_info.map(state => state.state) : [],
        getOptionLabel: (option) => option,
    };

    function updateSize() {
        setSize(window.screen.width)
    }

    const loadGeometryData = async () => {
        let state_info = props.state_data.map(async (state) => {
            try {
                const lat_long = await getGeoCode(state.state)
                let geo_json_coords
                let geometry, code
                if (lat_long.data.results.length) {
                    geometry = lat_long.data.results[0].locations[0].latLng
                    code = lat_long.data.results[0].locations[0].adminArea3
                    geo_json_coords = await getGeoJson(code)
                    geo_json_coords = geo_json_coords.data.coordinates
                }
                const cases_scale = state.cases / props.us_data.cases
                return {
                    ...state,
                    geometry: geometry,
                    cases_scale: cases_scale,
                    code: code,
                    geo_json_coords: geo_json_coords
                }
            } catch (err) {
                // if api for getode failed
                // don't update the geometry data
                console.log('fialed to get', err)
                return { ...state }
            }
        })
        state_info = await Promise.all(state_info)
        // filter all records without geometry state_data
        state_info = state_info.filter(state => state.geometry !== undefined)
        setStateInfo(state_info)
        setIsLoading(false)
    }

    React.useEffect(() => {
        if (props.state_data.length) {
            // load geometry data async to avoid having page loading slowly
            setIsLoading(true)
            loadGeometryData()
        }
        setCovidInfo(props.us_data)
        updateSize(window.screen.width)
        window.addEventListener('resize', updateSize);
    }, [])

    const timeConverter = (UNIX_timestamp) => {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = /* a.getFullYear(); */ 2021
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    const handleValueChange = async (value) => {
        if (!open) setOpen(true);
        setValue(value)
        if (value) {
            const current_state_info = state_info.filter(state => state.state === value)[0]
            setCovidInfo(current_state_info)
            setCountryTitle(current_state_info.state)
        } else {
            setCovidInfo(props.us_data)
            setCountryTitle('')
            let new_state_info = state_info
            new_state_info = state_info.map(new_state => {
                new_state.show_info = false
                return new_state
            })
            setStateInfo(new_state_info)
        }
    }

    const handleMarkerClick = (state) => {
        console.log('marker clicked', state)
        handleValueChange(state.state)
        let new_state_info = state_info
        new_state_info = state_info.map(new_state => {
            if (new_state.state === state.state) new_state.show_info = true
            else new_state.show_info = false
            return new_state
        })
        setStateInfo(new_state_info)
    };

    const drawer_content = <>
        <DrawerHeader>
            <Autocomplete
                {...defaultProps}
                id="select-on-focus"
                selectOnFocus
                fullWidth
                renderInput={(params) => (
                    <TextField {...params} label="Search by state" variant="standard" />
                )}
                value={value}
                onChange={(event, value) => {
                    handleValueChange(value)
                }}
            />
            <IconButton style={{ marginLeft: theme.spacing(1) }} onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </DrawerHeader>
        {value && <SidebarDiv>
            <Stack direction="row" spacing={1}>
                <Chip
                    label={value}
                    onClick={handleClick}
                    onDelete={handleDelete}
                    color="primary"
                    variant="outlined"
                />
            </Stack>
        </SidebarDiv>}
        <SidebarDiv className={classes.active_title}>
            <Typography variant="h6" gutterBottom component="div">
                {`${country_title.length ? country_title : 'US'} Total Cases`}
            </Typography>
        </SidebarDiv>
        <SidebarDiv className={classes.total_count}>
            <Typography variant="h4" gutterBottom component="div">
                {new Intl.NumberFormat().format(covid_info.cases)}
            </Typography>
        </SidebarDiv>

        <SidebarDiv>
            <TipsAndUpdatesIcon className={classes.info_icon} />
            <Typography variant="caption" display="block" gutterBottom>
                {`Last updated: ${timeConverter(covid_info.updated)}`}
            </Typography>
        </SidebarDiv>
        <Divider />
        <List>
            {['tested', 'active', 'recovered', 'deaths', 'today\'s cases'].map((text, index) => (
                <ListItem key={text}>
                    <ListItemIcon>
                        {getIcon(text)}
                    </ListItemIcon>
                    <ListItemText primary={text.toUpperCase()} secondary={new Intl.NumberFormat().format(covid_info[text])} />

                </ListItem>
            ))}
        </List>
        <Divider />
    </>

    const map = <Map
        state_info={state_info}
        onMarkerClick={handleMarkerClick}
        covid_info={covid_info}
        zoom={size <= 767 ? 3 : 4}
    />

    // const container = window !== undefined ? () => window().document.body : undefined;


    console.log(props, state_info, size)

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={size > 767 && { mr: 2, ...(open && { display: 'none' }) } }
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {header_text}
                    </Typography>
                </Toolbar>
            </AppBar>
            {size > 767 && <Drawer
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
                open={open}
            >
                {drawer_content}
            </Drawer>}
            {size <= 767 &&<Drawer
                // container={container}
                variant="temporary"
                open={open}
                onClose={() => setOpen(false)}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    // display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: mobileDrawerWidth },
                }}
            >
                {drawer_content}
            </Drawer>}

            {/** Render map based on screen width */}
            {size > 767 ? <Main open={open}>
                <DrawerHeader />
                {isLoading && <Loader />}
                {map}
            </Main> : <div style={{ width: `100%` }}>
                <DrawerHeader />
                {isLoading && <Loader />}
                {map}
            </div>}
        </Box>
    );
}

// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    try {
        let us_data = await getCountryData('USA')
        us_data = {
            updated: us_data.data.updated,
            cases: us_data.data.cases,
            tested: us_data.data.tests,
            active: us_data.data.active,
            recovered: us_data.data.recovered,
            deaths: us_data.data.deaths,
            ['today\'s cases']: us_data.data.todayCases
        }
        let state_data = await getStateData()
        state_data = state_data.data.map(state => {
            /* const lat_long = await getGeoCode(state.state)
            let geometry
            if(lat_long.data.results.length){
                geometry = lat_long.data.results[0].locations[0].latLng
            } */
            return {
                state: state.state,
                updated: state.updated,
                cases: state.cases,
                tested: state.tests,
                active: state.active,
                recovered: state.recovered,
                deaths: state.deaths,
                ['today\'s cases']: state.todayCases
            }
        })
        // Pass data to the page via props
        return { props: { state_data, us_data } }
    } catch (err) {
        // log error
        console.log(err)
        if (!err.status && err.message) err = err.message
        // Pass data to the page via props
        return { props: { error: err } }
    }
}