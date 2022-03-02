import * as React from 'react';
import {styled} from '@mui/material/styles';
import Loader from '../Loader'
import { drawerWidth, mobileDrawerWidth } from '../../lib/utils'
import Map from '../Map'


const DrawerHeader=styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0,1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));


const _main=styled('main',{shouldForwardProp: (prop) => prop!=='open'})(
    ({theme,open}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin',{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open&&{
            transition: theme.transitions.create('margin',{
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

export default function Main(props) {
    console.log('main props', props)
    const map=<Map
        state_info={props.state_info}
        onMarkerClick={props.handleMarkerClick}
        covid_info={props.covid_info}
        zoom={props.window_size<=767? 3:4}
    />

    return (<>
        {/** Render map based on screen width */}
        {props.window_size > 767 ? <_main open={props.open}>
            <DrawerHeader />
            {props.isLoading && <Loader />}
            {map}
        </_main>:<div style={{width: `100%`}}>
            <DrawerHeader />
            {props.isLoading && <Loader />}
            {map}
        </div>}
    </>
    )
}