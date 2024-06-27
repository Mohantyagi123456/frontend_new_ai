import React, { useState } from 'react';
import {
    Comparators,
    EuiBasicTable,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiLink
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';

const FutureDataGridTable = ({ userData }) => {
    const navigate = useNavigate();
    const dataSource = Object.keys(userData).map((key, index) => ({
        key: index,
        name: key,
        details: userData[key]
    }));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchValue, setSearchValue] = useState('');
    const [nestedTable,SetNestedTable] = useState(false)
    
    const [selectedItems, setSelectedItems] = useState([]); // New state for selected items

    const HandleOpenRecord = (dataItem) => {
        console.log("Clicked item data:", dataItem);
        const kk = dataItem.details
        navigate("strategy", { state: { kk } })
       
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
        console.log("selectedItems", selectedItems);
        setSelectedItems(selectedItems);
    };

    const selection = {
        selectable: (user) => true,
        selectableMessage: (selectable) => (!selectable ? 'Not selectable' : undefined),
        onSelectionChange: onSelectionChange,
        initialSelected: selectedItems
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
            </EuiFlexGroup>
            <EuiSpacer size="l" />
            <EuiBasicTable
                tableCaption="Demo of EuiBasicTable with actions"
                items={pageOfItems}
                itemId="key"
                columns={columns}
                pagination={pagination}
                sorting={sorting}
                selection={selection}
                onChange={onTableChange}
                hasActions={true}
            />
        </>
    );
};

export default FutureDataGridTable;
