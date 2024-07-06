import React, { useState,useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import UsersModalComponent from './UsersModalComponent';

const CustomTable = ({ userData }) => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchValue, setSearchValue] = useState('');
  const [filterOption, setFilterOption] = useState({
    is_active: '',
  });
  const [lastRunDate, setLastRunDate] = useState('');
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // New state for selected items
  const [isModalVisible, setIsModalVisible] = useState(false);
  const[UsersData,setUsersData]= useState("")
  const closeUpdateModal = () => setIsModalUpdateVisible(false);
  const showUpdateModal = () => setIsModalUpdateVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
console.log("isModalUpdateVisible",isModalUpdateVisible)
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
    if (userData.length > 0) {
      const latestDate = userData.reduce((maxDate, user) => {
        const currentDate = new Date(user.last_run_dt);
        return currentDate > maxDate ? currentDate : maxDate;
      }, new Date(0));

      setLastRunDate(formatDate(latestDate)); // Assuming formatDate function is defined as in your original code
    }
  }, [userData]);
const updateStatusDetails=(data)=>{
  showUpdateModal()
  setUsersData(data)
}
const gotToDetails = (user,item)=>{
  console.log("user,item",user,item)
  navigate(`/all-users/details/${item.id}`, {state:item});
}
  const columns = [
    {
      field: 'full_name',
      name: 'Full Name',
      truncateText: true,
      sortable: true,
      render: (user, item) => (
        <EuiLink onClick={(user)=>{gotToDetails(user,item)}}>
            {user}
        </EuiLink>
    ),
      mobileOptions: {
        render: (user) => (
          <EuiLink href="#" target="_blank">
            {user.full_name}
          </EuiLink>
        ),
      },
    },
    {
      field: 'email',
      name: 'Email',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'pan_card',
      name: 'PanCard',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'aadhaar_card',
      name: 'Aadhaar Card',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'is_active',
      name: 'Is Active',
      dataType: 'boolean',
      render: (is_active) => {
        const color = is_active ? 'success' : 'danger';
        const label = is_active ? <EuiBetaBadge size="s" label="true" iconType="check" className='success' /> : <EuiBetaBadge size="s" label="false" iconType="cross" className='danger' />;
        return <EuiFlexItem grow={false}>
          {label}
        </EuiFlexItem>;
      },
      sortable: true,
    },
    {
        field: 'date_joined',
        name: 'Joining Date',
        dataType: 'date',
        sortable: true,
        render: (date_joined) => formatDate(date_joined),
      },
    {
      field: '',
      name: 'Action',
      truncateText: true,
      render: (user) => {
        return <EuiButtonIcon display="base" onClick={()=>updateStatusDetails(user)} iconType="pencil" size="xs" aria-label="Next"/>
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
      is_active: '',
    });
    setSearchValue('');
    setPageIndex(0); // Reset pageIndex when filters are cleared
    closeModal();
  };

//   const ByCurrentStatus = [
//     { text: 'bull_cf', value: 'bull_cf' },
//     { text: 'bear_cf', value: 'bear_cf' },
//     { text: 'bull', value: 'bull' },
//     { text: 'bear', value: 'bear' },
//   ];
//   const ByPreviousStatus = [
//     { text: 'bull_cf', value: 'bull_cf' },
//     { text: 'bear_cf', value: 'bear_cf' },
//     { text: 'bull', value: 'bull' },
//     { text: 'bear', value: 'bear' },
//   ];

  const ByIsActive = [
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
          user.full_name.toLowerCase() === normalizedSearchValue
          ||
          user.email.toLowerCase() === normalizedSearchValue
          ||
          user.pan_card.toLowerCase() === normalizedSearchValue
          ||
          user.aadhaar_card.toLowerCase() === normalizedSearchValue
      );
    }

    if (filterOption.is_active) {
      const isChanged = filterOption.is_active === 'true';
      items = items.filter((user) => user.is_active === isChanged);
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
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiFieldSearch
            placeholder="Search by name"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </EuiFlexItem>
        {/* <EuiFlexItem grow={false} style={{ marginLeft: 'auto', marginRight: '-150px' ,fontWeight:"700"}}>
          <div>
            Last Run Date: {lastRunDate}
          </div>
        </EuiFlexItem> */}
        <div style={{ marginLeft: "50%", display: "flex", marginTop: "5px" }}>
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
                  <EuiFormRow label="Filter by Is Active">
                    <EuiSelect
                      name="is_active"
                      options={ByIsActive}
                      value={filterOption.is_active}
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
      <UsersModalComponent UsersData={UsersData != undefined?UsersData:""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
    </>
  );
};

export default CustomTable;
