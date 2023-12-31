import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery , Button} from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { openDrawer } from '../../actions/menu/menu';

//redux import
import { getCategories } from 'actions/master/category';
import { getSubjects } from 'actions/master/subject';
import { getMediums } from 'actions/master/medium';
import { getLevels } from 'actions/master/level';
import { getLanguages } from 'actions/master/language';
import { getCourses } from 'actions/course/course';
import { getImportantIssues } from 'actions/master/importantIssues';
import { getWeeklyNews } from 'actions/master/weeklyNew';
import {getUser} from "actions/user/user";
import { getLead } from 'actions/lead/lead';
import { getEmployee } from 'actions/employee/employee';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const getReduxData = async () => {
            await dispatch(getCategories());
            await dispatch(getSubjects());
            await dispatch(getMediums());
            await dispatch(getLevels());
            await dispatch(getLanguages());
            await dispatch(getCourses());
            await dispatch(getImportantIssues());
            await dispatch(getWeeklyNews());
            await dispatch(getUser());
            await dispatch(getLead());
            await dispatch(getEmployee());
        };
        getReduxData();
    }, [dispatch]);
    
    const theme = useTheme();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

    const drawerOpen  = useSelector((state) => state.menu.drawerOpen);

    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownLG);
        dispatch(openDrawer({ drawerOpen: !matchDownLG }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG]);

    useEffect(() => {
        if (open !== drawerOpen) setOpen(drawerOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Header open={open} handleDrawerToggle={handleDrawerToggle} />
            <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Toolbar />
                <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
                
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
