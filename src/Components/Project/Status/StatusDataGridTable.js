import React, { useState, useEffect } from 'react';
import {
  Comparators,
  EuiBasicTable,
  EuiLink,
  EuiHealth,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiButtonEmpty,
  EuiFieldSearch,
  EuiFormRow,
  EuiSelect,
  EuiIcon,
  EuiButton,
  EuiBetaBadge,
  EuiModal,
  EuiBadge,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiButtonIcon,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';
import StatusModalComponent from './StatusModalComponent';

const CustomTable = ({ userData }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('firstName');
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
  const [statusData, setStatusData] = useState("")
  const closeUpdateModal = () => setIsModalUpdateVisible(false);
  const showUpdateModal = () => setIsModalUpdateVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  console.log("isModalUpdateVisible", isModalUpdateVisible)
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
      console.log("latestDate", latestDate)
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
      field: 'LTP',
      name: 'LTP',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'current_status',
      name: 'Current Status',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'previous_status',
      name: 'Previous Status',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'bull_bear_value',
      name: 'Bull Bear Value',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'current_status_start_dt',
      name: 'current_status_start_dt',
      dataType: 'date',
      sortable: true,
      render: (current_status_start_dt) => formatDate(current_status_start_dt),
    },
    {
      field: 'previous_status_start_dt',
      name: 'Previous Status Start Dt',
      dataType: 'date',
      sortable: true,
      render: (previous_status_start_dt) => formatDate(previous_status_start_dt),
    },
    {
      field: 'is_changed',
      name: 'is_changed',
      dataType: 'boolean',
      render: (is_changed) => {
        const color = is_changed ? 'success' : 'danger';
        const label = is_changed ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
        return <EuiFlexItem grow={false}>
          {label}
        </EuiFlexItem>;
      },
      sortable: true,
    },
    {
      field: '',
      name: 'Action',
      truncateText: true,
      render: (user) => {
        return <EuiButtonIcon display="base" onClick={() => updateStatusDetails(user)} iconType="pencil" size="xs" aria-label="Next" />
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

  const ByCurrentStatus = [
    { text: 'All', value: '' },
    { text: 'bull_cf', value: 'bull_cf' },
    { text: 'bear_cf', value: 'bear_cf' },
    { text: 'bull', value: 'bull' },
    { text: 'bear', value: 'bear' },
  ];
  const ByPreviousStatus = [
    { text: 'All', value: '' },
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
        (user) =>
          user.symbol.toLowerCase() === normalizedSearchValue
          ||
          user.current_status.toLowerCase() === normalizedSearchValue
      );
    }

    if (filterOption.current_status) {
      items = items.filter((user) => user.current_status === filterOption.current_status);
    }
    if (filterOption.previous_status) {
      items = items.filter((user) => user.previous_status === filterOption.previous_status);
    }

    if (filterOption.is_changed) {
      const isChanged = filterOption.is_changed === 'true';
      items = items.filter((user) => user.is_changed === isChanged);
    }

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

  return (
    <>
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
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiFormRow label="Filter by Current Status">
                    <EuiSelect
                      name="current_status"
                      options={ByCurrentStatus}
                      value={filterOption.current_status}
                      onChange={handleFilterChange}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Filter by Previous Status">
                    <EuiSelect
                      name="previous_status"
                      options={ByPreviousStatus}
                      value={filterOption.previous_status}
                      onChange={handleFilterChange}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Filter by Change Status">
                    <EuiSelect
                      name="is_changed"
                      options={ByIsChanged}
                      value={filterOption.is_changed}
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
      <StatusModalComponent statusData={statusData != undefined ? statusData : ""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
    </>
  );
};

export default CustomTable;
