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
    const [gtdDate, setGtdDate] = useState(moment())
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
    const [statusData, setStatusData] = useState("")
    const closeUpdateModal = () => setIsModalUpdateVisible(false);
    const showUpdateModal = () => setIsModalUpdateVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);
    const openExportModal = () => setExportModalOpen(true)
    const closeExportModal = () => setExportModalOpen(false);
    console.log("isModalUpdateVisible", userData)
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
        showUpdateModal()
        setStatusData(data)
    }
    const columns = [
        {
            field: 'symbol',
            name: 'Symbol',
            truncateText: true,
            sortable: true,
            mobileOptions: {
                render: (user) => (
                    <EuiLink href="#" target="_blank">
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
        // {
        //   field: 'ath_date',
        //   name: 'ATH Date',
        //   truncateText: true,
        //   sortable: true,
        //   mobileOptions: {
        //     show: false,
        //   },
        // },
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

        // {
        //   field: 'is_changed',
        //   name: 'is_changed',
        //   dataType: 'boolean',
        //   render: (is_changed) => {
        //     const color = is_changed ? 'success' : 'danger';
        //     const label = is_changed ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
        //     return <EuiFlexItem grow={false}>
        //       {label}
        //     </EuiFlexItem>;
        //   },
        //   sortable: true,
        // },
        {
            field: '',
            name: 'Action',
            truncateText: true,
            render: (user) => {
                return <EuiButtonIcon display="base" onClick={() => updateStatusDetails(user)} iconType="pencil" size="xs" aria-label="Next" />
            }
            // sortable: true,
            // mobileOptions: {
            //   render: (user) => (

            //     <button>ff</button>
            //   ),
            // },
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
        { text: 'All', value: '' },
        { text: 'DCC', value: 'DCC' },
        { text: 'WCC', value: 'WCC' },
        { text: 'MCC', value: 'MCC' }
    ];
    // const ByPreviousStatus = [
    //     { text: 'All', value: '' },
    //     { text: 'bull_cf', value: 'bull_cf' },
    //     { text: 'bear_cf', value: 'bear_cf' },
    //     { text: 'bull', value: 'bull' },
    //     { text: 'bear', value: 'bear' },
    // ];

    // const ByIsChanged = [
    //     { value: '', text: 'Select change status' },
    //     { value: 'true', text: 'True' },
    //     { value: 'false', text: 'False' },
    // ];

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

        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(startIndex, startIndex + pageSize);
        console.log("pageOfItems", pageOfItems)

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
            console.log("rowrowrowrow", selectedItems)
            // Extract selected rows and convert to CSV format
            const csvData = formattedRows.map(row =>
            // Map each row to an object containing all fields
            console.log("rowrow",row)
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
        e.preventDefault();
        closeExportModal()
        if (customerIdData != "") {
            handleExportCSV()
        }
    }


    const AddtoWatchlist = () => {
        navigate('/watch-list', { state: { selectedItems, form: "equityAnalysis" } });
    }


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
                <EuiFlexItem grow={true} style={{ marginLeft: 'auto',marginRight:"-425px", fontWeight: "700" }}>
                    <div>
                        Last Update : {lastRunDate}
                    </div>
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

            <EquityModalComponent statusData={statusData != undefined ? statusData : ""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
        </>
    );
};

export default EquityDataGridTable;
