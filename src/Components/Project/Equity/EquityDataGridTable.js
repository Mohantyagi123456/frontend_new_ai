import React, { useState, useEffect } from 'react';
import {
    Comparators,
    EuiBasicTable,
    EuiLink,
    EuiHealth,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiFieldSearch,
    EuiFormRow,
    EuiSelect,
    EuiIcon,
    EuiButton,
    EuiForm,
    EuiFieldText,
    EuiButtonEmpty,
    EuiModal,
    EuiDatePicker,
    EuiBadge,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiButtonIcon,
    EuiModalHeaderTitle,
    EuiOverlayMask,
} from '@elastic/eui';
import moment from 'moment';
import EquityModalComponent from './EquityModalComponent';
import { useNavigate, useLocation } from 'react-router-dom';


const EquityDataGridTable = ({ userData }) => {
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('firstName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchValue, setSearchValue] = useState('');
    const [gtdDate, setGtdDate] = useState(moment());
    const [filterOption, setFilterOption] = useState({
        current_status: '',
        previous_status: '',
        is_changed: '',
        cc_date_range: 'all',
        trade_status: ""
    });
    const [lastRunDate, setLastRunDate] = useState('');
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]); // New state for selected items
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [statusData, setStatusData] = useState('');
    const closeUpdateModal = () => setIsModalUpdateVisible(false);
    const showUpdateModal = () => setIsModalUpdateVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);
    const openExportModal = () => setExportModalOpen(true);
    const closeExportModal = () => setExportModalOpen(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    function NewformatDate(date) {
        return date.toString().split(' GMT')[0];
    }
    useEffect(() => {
        if (userData.length > 0) {
            const latestDate = userData.reduce((maxDate, user) => {
                const currentDate = new Date(user.last_run_dt);
                return currentDate > maxDate ? currentDate : maxDate;
            }, new Date(0));

            setLastRunDate(NewformatDate(latestDate)); // Assuming formatDate function is defined as in your original code
        }
    }, [userData]);
    const updateStatusDetails = (data) => {
        showUpdateModal();
        setStatusData(data);
    };
    const gotToDetails = (user,item)=>{
        console.log("user,item",user,item)
        navigate('/equity/details', {state:item });
    }
    const columns = [
        {
            field: 'symbol',
            name: 'Symbol',
            truncateText: true,
            sortable: true,
            render: (user, item) => (
                <EuiLink onClick={(user)=>{gotToDetails(user,item)}}>
                    {user}
                </EuiLink>
            ),
            mobileOptions: {
                render: (user) => (
                    <EuiLink onClick={(user)=>{gotToDetails(user)}}>
                        {user.symbol}
                    </EuiLink>
                ),
            },
            
        },
        {
            field: 'version',
            name: 'Version',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'trade_status',
            name: 'Trade Status',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'ath',
            name: 'ATH',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'ath_date',
            name: 'ATH Date',
            dataType: 'date',
            sortable: true,
            render: (ath_date) => formatDate(ath_date),
        },

        {
            field: 'cc_date',
            name: 'CC Date',
            dataType: 'date',
            sortable: true,
            render: (cc_date) => formatDate(cc_date),
        },
        {
            field: 'entry_date',
            name: 'Entry Date',
            dataType: 'date',
            sortable: true,
            render: (entry_date) => formatDate(entry_date),
        },
        {
            field: '',
            name: 'Action',
            truncateText: true,
            render: (user) => {
                return (
                    <EuiButtonIcon
                        display="base"
                        onClick={() => updateStatusDetails(user)}
                        iconType="pencil"
                        size="xs"
                        aria-label="Next"
                    />
                );
            },
        },
    ];

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setPageIndex(0); // Reset pageIndex when search changes
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOption((prevFilterOption) => ({
            ...prevFilterOption,
            [name]: value,
        }));
        setPageIndex(0); // Reset pageIndex when filter changes
    };

    const handleClearFilters = () => {
        setFilterOption({
            current_status: '',
            is_changed: '',
            cc_date_range: 'all',
            trade_status: ''
        });
        setSearchValue('');
        setPageIndex(0); // Reset pageIndex when filters are cleared
        closeModal();
    };

    const ByVersion = [
        { text: 'All', value: '' },
        { text: 'DCC', value: 'DCC' },
        { text: 'WCC', value: 'WCC' },
        { text: 'MCC', value: 'MCC' },
    ];

    const ByDateRange = [
        { text: 'All', value: 'all' },
        { text: 'Today', value: 'today' },
        { text: '1 Week', value: '1week' },
        { text: '1 Month', value: '1month' },
        { text: '1 Year', value: '1year' },
    ];

    const ByOrderType = [
        { text: 'All', value: '' },
        { text: 'Entry', value: 'Entry' },
        { text: 'Target 1', value: 'Target 1' },
        { text: 'Target 2', value: 'Target 2' },
        { text: 'Target 3', value: 'Target 3' },
        { text: 'Target 4', value: 'Target 4' },
        { text: 'Target 5', value: 'Target 5' },
        { text: 'CC Formed', value: 'CC_FORMED' },
        { text: 'SL', value: 'SL' }

    ];

    const filterByDateRange = (items) => {
        if (filterOption.cc_date_range === 'all') return items;

        const today = moment().startOf('day');
        let selectedDateRange;

        switch (filterOption.cc_date_range) {
            case 'today':
                selectedDateRange = today;
                break;
            case '1week':
                selectedDateRange = today.subtract(1, 'week');
                break;
            case '1month':
                selectedDateRange = today.subtract(1, 'month');
                break;
            case '1year':
                selectedDateRange = today.subtract(1, 'year');
                break;
            default:
                selectedDateRange = null;
        }

        return items.filter((item) => moment(item.cc_date).isSameOrAfter(selectedDateRange));
    };

    const findUsers = (users, pageIndex, pageSize, sortField, sortDirection) => {
        let items = [...users];

        if (sortField) {
            items.sort(Comparators.property(sortField, Comparators.default(sortDirection)));
        }

        if (searchValue) {
            const normalizedSearchValue = searchValue.trim().toLowerCase();
            items = items.filter(
                (user) =>
                    user.symbol.toLowerCase() === normalizedSearchValue
            );
        }

        if (filterOption.version) {
            items = items.filter((user) => user.version === filterOption.version);
        }

        if (filterOption.trade_status) {
            items = items.filter((user) => user.trade_status === filterOption.trade_status);
        }

        items = filterByDateRange(items);

        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(startIndex, startIndex + pageSize);

        return {
            pageOfItems,
            totalItemCount: items.length,
        };
    };

    const { pageOfItems, totalItemCount } = findUsers(
        userData,
        pageIndex,
        pageSize,
        sortField,
        sortDirection
    );

    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [10, 20, 50],
    };

    const sorting = {
        sort: {
            field: sortField,
            direction: sortDirection,
        },
    };

    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize } = page;

        const { field: sortField, direction: sortDirection } = sort;

        setPageIndex(pageIndex);
        setPageSize(pageSize);
        setSortField(sortField);
        setSortDirection(sortDirection);
    };



    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    const onSelectionChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    const selection = {
        selectable: (user) => true,
        selectableMessage: (selectable) => (!selectable ? 'Not selectable' : undefined),
        onSelectionChange: onSelectionChange,
    };

    const [customerIdData, setCustomerIdData] = useState("")
    const handleExportCSV = () => {

        if (selectedItems.length != 0) {
            const formattedRows = selectedItems.map(row => ({
                ...row,
                ath_date: formatDate(row.ath_date),
                cc_date: formatDate(row.cc_date),
                entry_date: formatDate(row.entry_date),
                // Add more fields as needed
            }));
            // Extract selected rows and convert to CSV format
            const csvData = formattedRows.map(row =>
            // Map each row to an object containing all fields

            ({
                'exchange': 'NSE',
                'ScripCode': row.exchange_token,
                'Company': row.symbol,
                "TriggerPrice": row?.entries ? row?.entries?.trigger : "",
                'OrderPrice': "",
                "OrderQty": "",
                "DisclosedQty": 0,
                "BuySell": "BUY",
                "OrderType": "",
                "RMS": "",
                "PriceType": "",
                "CustomerId": customerIdData,
                "S2KID": "",
                "OrderID": "",
                "ExecQty": "",
                "ExecPrice": "",
                "OrderValue": "",
                "GTDDate": gtdDate
            })
            );

            // Create CSV file
            const csvHeaders = Object.keys(csvData[0]);
            const csvRows = csvData.map(row => csvHeaders.map(header => row[header]));
            const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

            // Create a Blob object and initiate download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'selected_data.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }

    };
    const handleExportSubmit = (e) => {
        // alert("hh")
        // e.preventDefault();
        closeExportModal()
        if (customerIdData != "") {
            alert("hh")
            handleExportCSV()
        }
    }
    const AddtoWatchlist = () => {
        navigate('/watch-list', { state: { selectedItems, form: "equityAnalysis" } });
    }




    console.log("statusData,", statusData)

    return (
        <div>
            <EuiBadge>
                Last Update: {lastRunDate}
            </EuiBadge>
            <p></p>
            <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                    <EuiFieldSearch
                        placeholder="Search by symbol"
                        value={searchValue}
                        onChange={handleSearchChange}
                        isClearable={true}
                        aria-label="Search by symbol"
                    />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButton onClick={showModal} iconType="filter">
                        Filters
                    </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButton onClick={() => selectedItems.length != 0 ? AddtoWatchlist() : ""} iconType="plus" isDisabled={selectedItems.length != 0 ? false : true}>
                        Add to Watchlist
                    </EuiButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButtonEmpty onClick={handleClearFilters}>Clear Filters</EuiButtonEmpty>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="l" />
            <EuiBasicTable
                tableCaption="Demo of EuiBasicTable with actions"
                items={pageOfItems}
                itemId="id"
                columns={columns}
                sorting={sorting}
                onChange={onTableChange}
                pagination={pagination}
                selection={selection}
            />

            {isModalVisible && (
                <EuiOverlayMask>
                    <EuiModal onClose={closeModal}>
                        <EuiModalHeader>
                            <EuiModalHeaderTitle>Filter</EuiModalHeaderTitle>
                        </EuiModalHeader>
                        <EuiModalBody>
                            <EuiForm component="form" onSubmit={handleFormSubmit}>
                                <EuiFlexGroup>
                                    <EuiFlexItem>
                                        <EuiFormRow label="Version">
                                            <EuiSelect
                                                name="version"
                                                value={filterOption.version}
                                                options={ByVersion}
                                                onChange={handleFilterChange}
                                            />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow label="CC Date Range">
                                            <EuiSelect
                                                name="cc_date_range"
                                                value={filterOption.cc_date_range}
                                                options={ByDateRange}
                                                onChange={handleFilterChange}
                                            />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow label="OrderType">
                                            <EuiSelect
                                                name="trade_status"
                                                value={filterOption.trade_status}
                                                options={ByOrderType}
                                                onChange={handleFilterChange}
                                            />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                 

                                </EuiFlexGroup>

                                <EuiSpacer />
                           
                            </EuiForm>
                        </EuiModalBody>
                        <EuiModalFooter>
                            <EuiButton onClick={handleClearFilters} color="danger">
                                Clear Filters
                            </EuiButton>
                            <EuiButton onClick={closeModal} fill>
                                Apply Filters
                            </EuiButton>
                        </EuiModalFooter>
                    </EuiModal>
                </EuiOverlayMask>
            )}

            {isModalUpdateVisible && (
                <EquityModalComponent statusData={statusData}
                    isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal}
                />
            )}
            <EuiSpacer size="l" />

        </div>
    );
};

export default EquityDataGridTable;
