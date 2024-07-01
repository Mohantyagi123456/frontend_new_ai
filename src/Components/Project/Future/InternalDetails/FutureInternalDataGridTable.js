import React, { useState } from 'react';
import {
    Comparators,
    EuiBasicTable,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiBetaBadge,
    EuiFlexItem,
    EuiSpacer,
    EuiButton,
    EuiLink
} from '@elastic/eui';
import { useLocation, useNavigate } from 'react-router-dom';

const FutureInternalDataGridTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { kk } = location.state || {};

    const dataSource = Object.keys(kk).map((key, index) => ({
        key: index,
        name: key,
        details: kk[key]
    }));

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchValue, setSearchValue] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [expandedRowKey, setExpandedRowKey] = useState(null); // State for expanded row key

    const HandleOpenRecord = (item) => {
        console.log("itemitem", item)
        // Toggle expanded row
        if (expandedRowKey === item.key) {
            setExpandedRowKey(null); // Collapse if already expanded
        } else {
            setExpandedRowKey(item.key); // Expand the selected row
        }
    };

    const columns = [
        {
            field: 'name',
            name: 'Symbol',
            truncateText: true,
            sortable: true,
            render: (name, item) => (
                <EuiLink onClick={() => HandleOpenRecord(item)}>
                    {name}
                </EuiLink>
            ),
            mobileOptions: {
                render: (user) => (
                    <span onClick={() => HandleOpenRecord(user)}>
                        {user.name}
                    </span>
                ),
            },
        }
    ];

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setPageIndex(0);
    };

    const findUsers = (users, pageIndex, pageSize, sortField, sortDirection) => {
        let items = [...users];

        if (sortField) {
            items.sort(Comparators.property(sortField, Comparators.default(sortDirection)));
        }

        if (searchValue) {
            const normalizedSearchValue = searchValue.trim().toLowerCase();
            items = items.filter(
                (user) => user.name.toLowerCase().includes(normalizedSearchValue)
            );
        }

        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(startIndex, startIndex + pageSize);

        return {
            pageOfItems,
            totalItemCount: items.length,
        };
    };

    const { pageOfItems, totalItemCount } = findUsers(
        dataSource,
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
        setSelectedItems(selectedItems);
    };

    const selection = {
        selectable: (user) => true,
        selectableMessage: (selectable) => (!selectable ? 'Not selectable' : undefined),
        onSelectionChange: onSelectionChange,
        initialSelected: selectedItems
    };

    const getExpandedRowColumns = (strategy_name) => {
        const baseColumns = [
            { field: 'name', name: 'Name' },
            { field: 'LTP', name: 'LTP' },
            { field: 'buy_sell', name: 'Buy/Sell' },
            { field: 'strike_price', name: 'Strike Price' },
            { field: 'trigger', name: 'Trigger' },
            { field: 'lot_size', name: 'Lot Size' },
            { field: 'order_type', name: 'Order Type' },
            { field: 'status', name: 'Status' },
            {
                field: 'is_triggered', name: 'Is Triggered',
                render: (is_triggered) => {
                    const color = is_triggered ? 'success' : 'danger';
                    const label = is_triggered ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                    return <EuiFlexItem grow={false}>
                        {label}
                    </EuiFlexItem>;
                }
            },
            {
                field: 'is_missed', name: 'Is Missed',
                render: (is_missed) => {
                    const color = is_missed ? 'success' : 'danger';
                    const label = is_missed ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                    return <EuiFlexItem grow={false}>
                        {label}
                    </EuiFlexItem>;
                }
            },
            {
                field: 'is_entry_on', name: 'Is Entry On',
                render: (is_entry_on) => {
                    const color = is_entry_on ? 'success' : 'danger';
                    const label = is_entry_on ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
                    return <EuiFlexItem grow={false}>
                        {label}
                    </EuiFlexItem>;
                }
            }
        ];

        if (!strategy_name.toLowerCase().includes('future')) {
            baseColumns.push(
                { field: 'option_side', name: 'Option Side' },
                { field: 'strategy_side', name: 'Strategy Side' }
            );
        }

        return baseColumns;
    };

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
                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="success"
                        size="s"
                        onClick={() => { navigate("/future-options") }}
                    >
                        Back
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="l" />
            <EuiBasicTable
                tableCaption="Demo of EuiBasicTable with actions"
                items={pageOfItems}
                itemId="key"
                columns={[
                    ...columns,
                    {
                        name: 'Actions',
                        actions: [
                            {
                                render: (item) => (
                                    <EuiLink onClick={() => HandleOpenRecord(item)}>
                                        {expandedRowKey === item.key ? 'Collapse' : 'Expand'}
                                    </EuiLink>
                                ),
                            },
                        ],
                    },
                ]}
                itemIdToExpandedRowMap={expandedRowKey !== null ? {
                    [expandedRowKey]: (
                        <div key={`nested-table-${expandedRowKey}`} style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <EuiBasicTable
                                items={pageOfItems.find(item => item.key === expandedRowKey)?.details || []}
                                columns={getExpandedRowColumns(pageOfItems.find(item => item.key === expandedRowKey)?.name)}
                            />
                        </div>
                    ),
                } : {}}
                pagination={pagination}
                sorting={sorting}
                selection={selection}
                onChange={onTableChange}
                hasActions={true}
            />
        </>
    );
};

export default FutureInternalDataGridTable;
