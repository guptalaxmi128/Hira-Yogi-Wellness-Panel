import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Grid,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
// import Dropdown from 'react-bootstrap/Dropdown';
// import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/user';
// import * as api from 'api';

const TABLE_HEAD = [
    { id: 'sno', label: 'SNo', alignRight: true },
    { id: 'name', label: 'Name', alignRight: true },
    { id: 'email', label: 'Email', alignRight: true },
    { id: 'phoneNumber', label: 'Mobile Number', alignRight: true },
    { id: 'userCode', label: 'Employee Code', alignRight: true }
    // { id: '3dots', label: <MoreVertIcon />, alignRight: true },
];

// ----------------------------------------------------------------------

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <MoreVertIcon />
    </a>
));

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const List = (props) => {
    const { user } = props;
    // console.log(user.data);

    const [listTable, setListTable] = useState(user.data);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = listTable.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - articlesTable.length) : 0;

    const filteredUsers = applySortFilter(listTable, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <>
            <Box sx={{ mt: 2 }}>
                <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={listTable.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {listTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((custInfo,index) => {
                                    const { id, name, email, userCode, phoneNumber } = custInfo;
                                    const SNo =index+1;
                                    const isItemSelected = selected.indexOf(id) !== -1;

                                    return (
                                        <TableRow
                                            hover
                                            key={id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {SNo}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                <Link to={"/user-detail"} style={{textDecoration:'none',color:'#000'}}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {name}
                                                    </Typography>
                                                    </Link>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {email}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {phoneNumber}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {userCode}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            {/* <TableCell align="center">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Button variant="contained" color="primary" type="submit">
                                                    View
                                                </Button>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Dropdown>
                                                    <Dropdown.Toggle as={CustomToggle} />
                                                    <Dropdown.Menu size="sm" title="">
                                                        <Dropdown.Item><EditIcon />&nbsp;&nbsp;&nbsp;  Edit</Dropdown.Item>
                                                        <Dropdown.Item><DeleteOutlineIcon />&nbsp;&nbsp;&nbsp;  Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                </Stack>
                                            </TableCell> */}
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>

                            {isUserNotFound && (
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                            <SearchNotFound searchQuery={filterName} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={listTable.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </>
    );
};

export default List;
