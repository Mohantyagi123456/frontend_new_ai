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
    EuiBadge,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiButtonIcon,
    EuiModalHeaderTitle,
    EuiOverlayMask,
} from '@elastic/eui';
import EquityOrderModalComponent from './EquityOrderModalComponent';

const EquityOrderDataGridTable = ({ orderData }) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('trading_symbol');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchValue, setSearchValue] = useState('');
    const [filterOption, setFilterOption] = useState({
        current_status: '',
        previous_status: '',
        is_changed: '',
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
            field: 'order_type',
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
        });
        setSearchValue('');
        setPageIndex(0); // Reset pageIndex when filters are cleared
        closeModal();
    };

    const ByVersion = [
        { text: 'DCC', value: 'DCC' },
        { text: 'WCC', value: 'WCC' },
        { text: 'MCC', value: 'MCC' }
    ];
    const ByPreviousStatus = [
        { text: 'bull_cf', value: 'bull_cf' },
        { text: 'bear_cf', value: 'bear_cf' },
        { text: 'bull', value: 'bull' },
        { text: 'bear', value: 'bear' },
    ];

    const ByIsChanged = [
        { value: '', text: 'Select change status' },
        { value: 'true', text: 'True' },
        { value: 'false', text: 'False' },
    ];

    const findUsers = (users, pageIndex, pageSize, sortField, sortDirection) => {
        let items = [...users];

        if (sortField) {
            items.sort(Comparators.property(sortField, Comparators.default(sortDirection)));
        }

        if (searchValue) {
            const normalizedSearchValue = searchValue.trim().toLowerCase();
            items = items.filter(
                (user) => user.trading_symbol && user.trading_symbol.toLowerCase().includes(normalizedSearchValue)
            );
        }

        if (filterOption.version) {
            items = items.filter((user) => user.version === filterOption.version);
        }

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
    const handleExportCSV = () => {

        if (selectedItems.length != 0) {
            const formattedRows = selectedItems.map(row => ({
                ...row,
                ath_date: formatDate(row.ath_date),
                cc_date: formatDate(row.cc_date),
                entry_date: formatDate(row.entry_date),
                // Add more fields as needed
            }));
            console.log("rowrowrowrow",selectedItems)
            // Extract selected rows and convert to CSV format
            const csvData = formattedRows.map(row =>
            // Map each row to an object containing all fields
            ({
                'exchange': 'NSE',
                'ScripCode': row.exchange_token,
                'Company': row.trading_symbol,
                'OrderPrice': "",
                "TriggerPrice": row?.entries ? row?.entries?.trigger : "",
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
                "GTDDate": ""
            })
            );

            // Create CSV file
            const csvHeaders = Object.keys(csvData[0]);
            const csvRows = csvData.map(row => csvHeaders.map(header => row[header]));
            const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(',')).join('\n')];

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
    console.log("selectedItemsselectedItems", selectedItems)


    return (
        <>
            <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiFieldSearch
                        placeholder="Search by name"
                        value={searchValue}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </EuiFlexItem>

                <div style={{ marginLeft: "50%", display: "flex", marginTop: "5px" }}>

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
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Filter by Version">
                                        <EuiSelect
                                            name="version"
                                            options={ByVersion}
                                            value={filterOption.version}
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
