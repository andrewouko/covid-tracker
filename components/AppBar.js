import * as React from 'react';
import {styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { drawerWidth, mobileDrawerWidth } from '../lib/utils'

const Bar = styled(MuiAppBar, {
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


export default function AppBar(props) {
    const [header_text, setHeaderText] = React.useState('Covid Tracker')

    return (
        <Bar position="fixed" open={props.open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={props.handleDrawerOpen}
                    edge="start"
                    sx={props.window_size > 767 && {mr: 2,...(props.open && {display: 'none'})}}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {header_text}
                </Typography>
            </Toolbar>
        </Bar>
    )
}