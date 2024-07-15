import React, { useState, useEffect } from 'react';
import {
    Comparators,
    EuiBasicTable,
    EuiLink,
    EuiBetaBadge,
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
    EuiBadge,
    EuiModalBody,
    EuiModalFooter,
    EuiDatePicker,
    EuiModalHeader,
    EuiButtonIcon,
    EuiModalHeaderTitle,
    EuiOverlayMask,
} from '@elastic/eui';
import moment from 'moment';
import FutureOrderModalComponent from './FutureOrderModalComponent';
import { useNavigate, useLocation } from 'react-router-dom';

const FutureOrderDataGridTable = ({ orderData }) => {
    const navigate = useNavigate();
    console.log("orderDataorderData", orderData)
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('modified_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchValue, setSearchValue] = useState('');
    const [filterOption, setFilterOption] = useState({
        order_type: '',
        previous_status: '',
        modified_at: "all",
        strategy_name: '',
    });
    const [lastRunDate, setLastRunDate] = useState('');
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]); // New state for selected items
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false)
    const [ordersData, setOrdersData] = useState("")
    const closeUpdateModal = () => setIsModalUpdateVisible(false);
    const showUpdateModal = () => setIsModalUpdateVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);
    const openExportModal = () => setExportModalOpen(true)
    const closeExportModal = () => setExportModalOpen(false);
    console.log("isModalUpdateVisible", orderData)
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

            setLastRunDate(formatDate(latestDate)); // Assuming formatDate function is defined as in your original code
        }
    }, [orderData]);
    const updateOrderDetails = (data) => {
        showUpdateModal()
        setOrdersData(data)
    }
    const columns = [
        {
            field: 'name',
            name: 'Name',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                render: (user) => (
                    <EuiLink href="#" target="_blank">
                        {user.name}
                    </EuiLink>
                ),
            },
        },
        {
            field: 'order_type',
            name: 'Order Type',
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
            field: 'status',
            name: 'Status',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'is_triggered', name: 'Triggered',
            render: (is_triggered) => {
                const color = is_triggered ? 'success' : 'danger';
                const label = is_triggered ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                return <EuiFlexItem grow={false}>
                    {label}
                </EuiFlexItem>;
            }
        },
        {
            field: 'is_missed', name: 'Missed',
            render: (is_missed) => {
                const color = is_missed ? 'success' : 'danger';
                const label = is_missed ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                return <EuiFlexItem grow={false}>
                    {label}
                </EuiFlexItem>;
            }
        },
        {
            field: 'is_entry_on', name: 'Entry On',
            render: (is_entry_on) => {
                const color = is_entry_on ? 'success' : 'danger';
                const label = is_entry_on ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                return <EuiFlexItem grow={false}>
                    {label}
                </EuiFlexItem>;
            }
        },
        {
            field: 'strategy_side', name: 'Strategy Side',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'strategy_name', name: 'Strategy Name',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'buy_sell', name: 'Buy/Sell',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                show: false,
            },
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
            order_type: '',
            modified_at: "all",
            strategy_name: '',
        });
        setSearchValue('');
        setPageIndex(0); // Reset pageIndex when filters are cleared
        closeModal();
    };

    const ByOrderType = [
        { text: 'All', value: 'all' },
        { text: 'Target 1', value: 'target_1' },
        { text: 'Target 2', value: 'target_2' },
        { text: 'Target 3', value: 'target_3' },
        { text: 'Target 4', value: 'target_4' },
        { text: 'Target 5', value: 'target_5' },
        { text: 'Entry', value: 'entry' }
    ];
    const ByStrategyName = [
        { text: 'All', value: 'all' },
        { text: 'SOS4d', value: 'SOS4d' },
        { text: 'BankNiftyFuture1d2d', value: 'BankNiftyFuture1d2d' },
        { text: 'StocksFuture2d3d', value: 'StocksFuture2d3d' },
        { text: 'BankNiftyFuture1d2d', value: 'BankNiftyFuture1d2d' },
    ];
    const ByDateRange = [
        { text: 'All', value: 'all' },
        { text: 'Today', value: 'today' },
        { text: '1 Week', value: '1week' },
        { text: '1 Month', value: '1month' },
        { text: '1 Year', value: '1year' },
    ];
    const filterByDateRange = (items) => {
        if (filterOption.modified_at === 'all') return items;

        const today = moment().startOf('day');
        let selectedDateRange;

        switch (filterOption.modified_at) {
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

        return items.filter((item) => moment(item.modified_at).isSameOrAfter(selectedDateRange));
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
                    user.name.toLowerCase() === normalizedSearchValue
                //   ||
                //   user.order_type.toLowerCase() === normalizedSearchValue
            );
        }
        items = filterByDateRange(items);
        if (filterOption.order_type) {
            items = items.filter((user) => user.order_type === filterOption.order_type);
        }
        if (filterOption.strategy_name) {
            items = items.filter((user) => user.strategy_name === filterOption.strategy_name);
        }

        // if (filterOption.strategy_name) {
        //   const isChanged = filterOption.strategy_name === 'true';
        //   items = items.filter((user) => user.strategy_name === isChanged);
        // }

        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(startIndex, startIndex + pageSize);

        return {
            pageOfItems,
            totalItemCount: items.length,
        };
    };

    const { pageOfItems, totalItemCount } = findUsers(
        orderData,
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

        setPageIndex(pageIndex || 0);
        setPageSize(pageSize || 10);
        if (sort.field) {
            setSortField(sort.field);
            setSortDirection(sort.direction);
        }
    };

    const onSelectionChange = (selectedItems) => {
        console.log("selectedItems", selectedItems)
        setSelectedItems(selectedItems);
    };

    const selection = {
        selectable: (user) => true,
        selectableMessage: (selectable) => (!selectable ? 'Not selectable' : undefined),
        onSelectionChange: onSelectionChange,
    };

    const [customerIdData, setCustomerIdData] = useState("")
    const [gtdDate, setGtdDate] = useState(moment())
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
                'ScripCode': row?.current_status?.instruments?.exchange_token,
                'ScripName': row?.current_status?.symbol,
                'OrderPrice': row?.buy_sell === "BUY" ? addFivePercent(row?.trigger) : subtractFivePercent(row?.trigger),
                "TriggerPrice": row?.trigger,
                "OrderQty": row?.lot_size,
                "DisclosedQty": 0,
                "BuySell": row?.buy_sell,
                "OrderType": "NEW",
                "RMS": "",
                "PriceType": "Limit",
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
        navigate('/watch-list', { state: { selectedItems, form: "futureOrders" } });
    }


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
            {/* <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiFieldSearch
                        placeholder="Search by name"
                        value={searchValue}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </EuiFlexItem>

                <div style={{ marginLeft: "50%", display: "flex", marginTop: "5px" }}>
                    <EuiFlexItem grow={false} style={{ fontWeight: "700" }} onClick={() => selectedItems.length != 0 ? AddtoWatchlist() : ""}>
                        <EuiBadge color="success" isDisabled={selectedItems.length != 0 ? false : true}>
                            <EuiIcon type="plus" /> &nbsp;Add to Watchlist
                        </EuiBadge>

                    </EuiFlexItem>
                    &nbsp; &nbsp;
                    <EuiFlexItem grow={false} style={{ fontWeight: "700" }} onClick={() => selectedItems.length != 0 ? openExportModal() : ""}>
                        <EuiBadge color="subdued" isDisabled={selectedItems.length != 0 ? false : true}>
                            <EuiIcon type="download" /> &nbsp;Download Files
                        </EuiBadge>

                    </EuiFlexItem>
                    &nbsp; &nbsp;
                    <EuiFlexItem grow={false} onClick={showModal}>
                        <EuiBadge color="subdued">
                            <EuiIcon type="filter" /> &nbsp;Filter
                        </EuiBadge>
                    </EuiFlexItem>
                    &nbsp; &nbsp;
                    <EuiFlexItem grow={false} onClick={handleClearFilters}>
                        <EuiBadge color="primary" size="m">
                            <EuiIcon type="filterIgnore" /> &nbsp;Clear Filter
                        </EuiBadge>
                    </EuiFlexItem>
                </div>
            </EuiFlexGroup> */}
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
                                    <EuiFormRow label="Order Type">
                                        <EuiSelect
                                            name="order_type"
                                            options={ByOrderType}
                                            value={filterOption.order_type}
                                            onChange={handleFilterChange}
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Strategy Name">
                                        <EuiSelect
                                            name="strategy_name"
                                            options={ByStrategyName}
                                            value={filterOption.strategy_name}
                                            onChange={handleFilterChange}
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Modified Date">
                                        <EuiSelect
                                            name="modified_at"
                                            value={filterOption.modified_at}
                                            options={ByDateRange}
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

            <FutureOrderModalComponent ordersData={ordersData != undefined ? ordersData : ""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
        </>
    );
};

export default FutureOrderDataGridTable;
