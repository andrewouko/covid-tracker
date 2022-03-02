import Avatar from '@mui/material/Avatar';
import { purple, yellow, green, blue, orange } from '@mui/material/colors';

export const getIcon = (type, width, height) => {
    type = type.toLowerCase();
    const size = { width: width || 28, height: height || 26 }
    switch (type) {
        case 'active':
            return <Avatar sx={{ bgcolor: yellow[500], ...size }}>A</Avatar>
        case 'deaths':
            return <Avatar sx={{ bgcolor: purple[500], ...size }}>D</Avatar>
        case 'recovered':
            return <Avatar sx={{ bgcolor: green[500], ...size }}>R</Avatar>
        case 'today\'s cases':
            return <Avatar sx={{ bgcolor: orange[500], ...size }}>+</Avatar>
        case 'tested':
            return <Avatar sx={{ bgcolor: blue[500], ...size }}>T</Avatar>
        default: return <Avatar sx={{ ...size }}>**</Avatar>
    }
}

export const drawerWidth=300;
export const mobileDrawerWidth = 220;
