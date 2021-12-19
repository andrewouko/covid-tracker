import React from 'react'
import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow } from '@react-google-maps/api';
import Typography from '@mui/material/Typography';
import { getIcon } from '../lib/utils';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { makeStyles } from '@mui/styles';


const containerStyle = {
    width: '100%',
    height: '495px'
};

const center = {
    lat: 39.099792, lng: -94.578559
};

const divStyle = {
    background: `white`,
    // border: `1px solid #ccc`,
    // padding: 10
}


const options = {
    fillColor: "lightblue",
    fillOpacity: 0.02,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: true,
    editable: true,
    geodesic: false,
    zIndex: 1
}
const useStyles = makeStyles({
    item: {
        // fontSize: '0.5rem'
        '& span, & svg, & p': {
            fontSize: '0.5rem'
        }
    }
});


function Map(props) {
    const classes = useStyles();

    const paths = [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 }
    ]
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
            >
                <>
                    { /* Child components, such as markers, info windows, etc. */}
                    {props.state_info && props.state_info.map((state, ix) => <>
                        <Marker
                            key={ix}
                            position={state.geometry}
                            onClick={() => props.onMarkerClick(state)}
                        />
                        {state.show_info && <InfoWindow
                            position={state.geometry}
                        >
                            <div style={divStyle}>
                            {/* <Typography variant="overline">
                                    {state.state}
                                </Typography> */}
                                <List>
                                    {['active', 'recovered', 'deaths'].map((text, index) => (
                                        <ListItem key={text} style={{padding: 0}} disablePadding disableGutters>
                                            <ListItemIcon>
                                                {getIcon(text, 17, 19)}
                                            </ListItemIcon>
                                            <ListItemText className={classes.item}  primary={text.toUpperCase()} secondary={new Intl.NumberFormat().format(props.covid_info[text])} />

                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </InfoWindow>}
                    </>)}
                    {/* <Polygon
                        paths={paths}
                        options={options}
                    /> */}
                </>
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)