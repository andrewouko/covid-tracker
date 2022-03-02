import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';

import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material'
import { Autocomplete, TextField, Stack, Chip } from '@mui/material';
import { getStateData, getGeoCode, getCountryData, getGeoJson } from '../lib/apis'
import { getIcon } from '../lib/utils';

import DetailsDrawer from '../components/DetailsDrawer'

import AppBar from '../components/AppBar'

import Main from '../components/content/Main'

const useStyles = makeStyles(() => ({
    title: {
    },
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

export default function Home(props) {
    console.log(props)
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    
    const [country_title, setCountryTitle] = React.useState('')
    const [value, setValue] = React.useState(null);
    const [state_info, setStateInfo] = React.useState([])
    const [covid_info, setCovidInfo] = React.useState({})
    const [isMarkerShown, setIsMarkerShown] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [window_size, setWindowSize] = React.useState(0);

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

    function updateSize() {
        setWindowSize(window.screen.width)
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
                console.log('failed to get geometry data', err)
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

    const handleValueChange = async (value) => {
        if (!open && window_size <= 767) setOpen(true);
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


    console.log(props, state_info, window_size)

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar {...{ handleDrawerOpen, window_size, open }}    />

            <DetailsDrawer {...{ handleDrawerClose, open, value, handleClick, handleDelete, country_title, covid_info, state_info, handleValueChange }}  />

            <Main {...{ handleMarkerClick, covid_info, state_info, window_size, isLoading, open }} />
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