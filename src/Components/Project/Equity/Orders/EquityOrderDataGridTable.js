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
    EuiDatePicker,
    EuiButtonEmpty,
    EuiModal,
    EuiBadge,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiButtonIcon,
    EuiModalHeaderTitle,
    EuiOverlayMask,
} from '@elastic/eui';
import moment from 'moment';
import EquityOrderModalComponent from './EquityOrderModalComponent';
import { useNavigate, useLocation } from 'react-router-dom';

const EquityOrderDataGridTable = ({ orderData }) => {
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('triggered_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchValue, setSearchValue] = useState('');
    const [gtdDate, setGtdDate] = useState(moment());
    const [filterOption, setFilterOption] = useState({
        current_status: '',
        previous_status: '',
        is_changed: '',
        triggered_at: 'all'
    });
    const [lastRunDate, setLastRunDate] = useState('');
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [ordersData, setOrdersData] = useState('');
    const [customerIdData, setCustomerIdData] = useState('');

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

    useEffect(() => {
        if (orderData.length > 0) {
            const latestDate = orderData.reduce((maxDate, user) => {
                const currentDate = new Date(user.last_run_dt);
                return currentDate > maxDate ? currentDate : maxDate;
            }, new Date(0));

            setLastRunDate(formatDate(latestDate));
        }
    }, [orderData]);

    const updateOrderDetails = (data) => {
        showUpdateModal();
        setOrdersData(data);
    };

    const columns = [
        {
            field: 'trading_symbol',
            name: 'Name',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                render: (user) => (
                    <EuiLink href="#" target="_blank">
                        {user.trading_symbol}
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
            field: 'trigger',
            name: 'Trigger',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'name',
            name: 'Order Type',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'triggered_at',
            name: 'Triggered Date',
            truncateText: true,
            sortable: true,
            render: (triggered_at) => formatDate(triggered_at),
        },
        {
            field: 'created_at',
            name: 'Created Date',
            dataType: 'date',
            sortable: true,
            render: (created_at) => formatDate(created_at),
        },
        {
            field: 'modified_at',
            name: 'Modified Date',
            dataType: 'date',
            sortable: true,
            render: (modified_at) => formatDate(modified_at),
        },
        {
            field: '',
            name: 'Action',
            truncateText: true,
            render: (user) => {
                return <EuiButtonIcon display="base" onClick={() => updateOrderDetails(user)} iconType="pencil" size="xs" aria-label="Next" />
            }
        },
    ];

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setPageIndex(0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOption((prevFilterOption) => ({
            ...prevFilterOption,
            [name]: value,
        }));
        setPageIndex(0);
    };

    const handleClearFilters = () => {
        setFilterOption({
            current_status: '',
            previous_status: '',
            is_changed: '',
            triggered_at: 'all',
            version: '',
            name: '',
        });
        setSearchValue('');
        setPageIndex(0);
        closeModal();
    };

    const ByVersion = [
        { text: 'All', value: '' },
        { text: 'DCC', value: 'DCC' },
        { text: 'WCC', value: 'WCC' },
        { text: 'MCC', value: 'MCC' }
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

    const ByDateRange = [
        { text: 'All', value: 'all' },
        { text: 'Today', value: 'today' },
        { text: '1 Week', value: '1week' },
        { text: '1 Month', value: '1month' },
        { text: '1 Year', value: '1year' },
    ];

    const filterByDateRange = (items) => {
        if (filterOption.triggered_at === 'all') return items;

        const today = moment().startOf('day');
        let selectedDateRange;

        switch (filterOption.triggered_at) {
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

        return items.filter((item) => moment(item.triggered_at).isSameOrAfter(selectedDateRange));
    };

    const findUsers = (users, pageIndex, pageSize, sortField, sortDirection) => {
        let items = [...users];

        if (sortField) {
            items.sort(Comparators.property(sortField, Comparators.default(sortDirection)));
        }

       

        if (searchValue) {
            const normalizedSearchValue = searchValue.trim().toLowerCase();
            const searchLength = Math.min(normalizedSearchValue.length, 9);
            items = items.filter(
                (user) => user.trading_symbol.toLowerCase().slice(0, searchLength) === normalizedSearchValue.slice(0, searchLength)
            );
        }

        if (filterOption.version) {
            items = items.filter((user) => user.version === filterOption.version);
        }
        if (filterOption.name) {
            items = items.filter((user) => user.name === filterOption.name);
        }
        items = filterByDateRange(items);

        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(startIndex, startIndex + pageSize);

        return {
            pageOfItems,
            totalItemCount: items.length,
        };
    };

    const { pageOfItems, totalItemCount } = findUsers(orderData, pageIndex, pageSize, sortField, sortDirection);

    const pagination = {
        pageIndex,
        pageSize,
        totalItemCount,
        pageSizeOptions: [10, 20, 50],
    };

    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize } = page;
        const { field: sortField, direction: sortDirection } = sort;
        setPageIndex(pageIndex);
        setPageSize(pageSize);
        setSortField(sortField);
        setSortDirection(sortDirection);
    };

    const onSelectionChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };


    const selection = {
        selectable: (user) => true,
        selectableMessage: (selectable) => (!selectable ? 'Not selectable' : undefined),
        onSelectionChange: onSelectionChange,
    };

    // const [customerIdData, setCustomerIdData] = useState("")

    function addFivePercent(amount) {
        // Calculate 5% of the given amount
        const fivePercent = amount * 0.03;

        // Add the 5% to the original amount
        const total = amount + fivePercent;

        // Return the total amount
        return total;
    }
    function subtractFivePercent(amount) {
        // Calculate 5% of the given amount
        const fivePercent = amount * 0.03;

        // Add the 5% to the original amount
        const total = amount - fivePercent;

        // Return the total amount
        return total;
    }
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
                'Exchange': 'NSE',
                'ScripCode': row?.bt_equity_analysis?.exchange_token,
                'ScripName': row?.trading_symbol,
                'OrderPrice': row?.buy_sell === "BUY" ? addFivePercent(row?.trigger) : subtractFivePercent(row?.trigger),
                "TriggerPrice": row?.trigger,
                "OrderQty": row?.quantity,
                "DisclosedQty": 0,
                "BuySell": row?.buy_sell ? row?.buy_sell : "BUY",
                "OrderType": "NEW",
                "RMS": "",
                "PriceType": "LIMIT",
                "CustomerId": customerIdData,
                "S2KID": customerIdData,
                "OrderID": 0,
                "ExecQty": 0,
                "ExecPrice": 0,
                "OrderValid": "GFD",
                "GTDDate": gtdDate.format('YYYY-MM-DD')
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
        e.preventDefault();
        closeExportModal()
        if (customerIdData != "") {
            handleExportCSV()
        }
    }
    const AddtoWatchlist = () => {
        console.log("selectedItemsselectedItems", selectedItems)
        navigate('/watch-list', { state: { selectedItems, form: "equityOrders" } });
    }
    const sorting = {
        sort: {
            field: sortField,
            direction: sortDirection,
        },
    };


    return (
        <>
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
                    <EuiButton onClick={() => selectedItems.length != 0 ? openExportModal() : ""} iconType="download" isDisabled={selectedItems.length != 0 ? false : true}>
                        Download Files
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
                            <EuiModalHeaderTitle>Filters</EuiModalHeaderTitle>
                        </EuiModalHeader>
                        <EuiModalBody>
                            <EuiFlexGroup direction="column">
                                <EuiFlexItem>
                                    <EuiFormRow label="Version">
                                        <EuiSelect
                                            name="version"
                                            options={ByVersion}
                                            value={filterOption.version}
                                            onChange={handleFilterChange}
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Trigger Range">
                                        <EuiSelect
                                            name="triggered_at"
                                            value={filterOption.triggered_at}
                                            options={ByDateRange}
                                            onChange={handleFilterChange}
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="OrderType">
                                        <EuiSelect
                                            name="name"
                                            options={ByOrderType}
                                            value={filterOption.name}
                                            onChange={handleFilterChange}
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
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

            {exportModalOpen && (
                <EuiOverlayMask>
                    <EuiModal onClose={closeExportModal}>
                        <EuiModalHeader>
                            <EuiModalHeaderTitle>Export Data In CSV Format</EuiModalHeaderTitle>
                        </EuiModalHeader>
                        <EuiModalBody>
                            <EuiForm component="form" >
                                <EuiFormRow label="Customer Id">
                                    <EuiFieldText
                                        name="customerId"
                                        value={customerIdData}
                                        onChange={(e) => setCustomerIdData(e.target.value)}
                                    />
                                </EuiFormRow>
                                <EuiFormRow label="Select Date">
                                    <EuiDatePicker
                                        selected={gtdDate}
                                        onChange={date => setGtdDate(date ? moment(date) : null)}
                                    />
                                </EuiFormRow>
                            </EuiForm>

                        </EuiModalBody>
                        <EuiModalFooter>
                            <EuiButtonEmpty onClick={closeExportModal}>Cancel</EuiButtonEmpty>
                            <EuiButton
                                type="submit"
                                // form={modalFormId}
                                onClick={handleExportSubmit}
                                fill
                            >
                                Save
                            </EuiButton>
                        </EuiModalFooter>
                    </EuiModal>

                </EuiOverlayMask>
            )}

            <EquityOrderModalComponent ordersData={ordersData != undefined ? ordersData : ""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
        </>
    );
};

export default EquityOrderDataGridTable;
