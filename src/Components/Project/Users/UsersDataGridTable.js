import React, { useState, useEffect } from 'react';
import {
  Comparators,
  EuiBasicTable,
  EuiLink,
  EuiSwitch,
  EuiButtonEmpty,
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
import axios from 'axios';

const CustomTable = ({ userData }) => {
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;
const KiteId = JSON.parse(localStorage.getItem('userData'));
const headers = {
  'Authorization': `Bearer ${KiteId?.access}`
};

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('date_joined');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchValue, setSearchValue] = useState('');
  const [filterOption, setFilterOption] = useState({
    is_active: '',
  });
  const [lastRunDate, setLastRunDate] = useState('');
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // New state for selected items
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminPermissionModal, setAdminPermissionModal] = useState(false);
  const [UsersData, setUsersData] = useState("")
  const closeUpdateModal = () => setIsModalUpdateVisible(false);
  const showUpdateModal = () => setIsModalUpdateVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  const AdminCloseModal = () => setAdminPermissionModal(false);
  const AdminShowModal = () => setAdminPermissionModal(true);
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


  useEffect(() => {
    if (userData.length > 0) {
      const latestDate = userData.reduce((maxDate, user) => {
        const currentDate = new Date(user.last_run_dt);
        return currentDate > maxDate ? currentDate : maxDate;
      }, new Date(0));

      setLastRunDate(formatDate(latestDate)); // Assuming formatDate function is defined as in your original code
    }
  }, [userData]);
  const updateStatusDetails = (data) => {
    showUpdateModal()
    setUsersData(data)
  }
  const gotToDetails = (user, item) => {
    console.log("user,item", user, item)
    navigate(`/all-users/details/${item.id}`, { state: item });
  }
  const columns = [
    {
      field: 'full_name',
      name: 'Full Name',
      truncateText: true,
      sortable: true,
      render: (user, item) => (
        <EuiLink onClick={(user) => { gotToDetails(user, item) }}>
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
      field: 'username',
      name: 'User Name',
      truncateText: true,
      sortable: true,
      mobileOptions: {
        show: false,
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
      field: 'contact',
      name: 'Contact',
      truncateText: true,
      sortable: true,
      render: (user, item) => (
       <> {item?.contact?.contact}</>

      ),
      mobileOptions: {
        show: false,
      },
    },
    // {
    //   field: 'aadhaar_card',
    //   name: 'Aadhaar Card',
    //   truncateText: true,
    //   sortable: true,
    //   mobileOptions: {
    //     show: false,
    //   },
    // },
    {
      field: 'is_active',
      name: 'Active',
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
      field: 'is_user',
      name: 'User Type',
      truncateText: true,
      sortable: true,
      render: (user, item) => (
        <> {item?.is_user == true ?<>User</>:item?.is_staff == true?<>Admin</>:item?.is_superuser == true?<>Super Admin</>:""}</>
 
       ),
      mobileOptions: {
        show: false,
      },
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
      const searchLength = Math.min(normalizedSearchValue.length, 9);
      items = items.filter(
        (user) =>
          (user?.full_name && typeof user?.full_name === 'string' && user.full_name.toLowerCase().slice(0, searchLength) === normalizedSearchValue.slice(0, searchLength)) ||
          (user?.email && typeof user?.email === 'string' && user.email.toLowerCase().slice(0, searchLength) === normalizedSearchValue.slice(0, searchLength)));
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
  const [isActiveChecked, setIsActiveChecked] = useState(false);
  const [checkedEquity, setCheckedEquity] = useState(false);
  const [checkedEquityOrder, setCheckedEquityOrder] = useState(false);
  const [checkedFutureAnalysis, setCheckedFutureAnalysis] = useState(false);
  const [checkedFutureOrder, setCheckedFutureOrder] = useState(false);
  const [checkedMonthlyStatus, setCheckedMonthlyStatus] = useState(false);

  const onChangeIsActive = (e) => {
    setIsActiveChecked(e.target.checked);
  };

  const onChangeEquity = (e) => {
    setCheckedEquity(e.target.checked);
  };
  const onChangeEquityOrder = (e) => {
    setCheckedEquityOrder(e.target.checked);
  };
  const onChangeFutureAnalysis = (e) => {
    setCheckedFutureAnalysis(e.target.checked);
  };
  const onChangeFutureOrder = (e) => {
    setCheckedFutureOrder(e.target.checked);
  };
  const onChangeMonthlyStatus = (e) => {
    setCheckedMonthlyStatus(e.target.checked);
  };

  function filterUserData(userDatas) {
    return userDatas.map(user => ({
      id: user.id,
      is_active: isActiveChecked,
      first_name: user.first_name,
      blaze_product_permissions: user.blaze_product_permissions
    }));
  }


  const handleApplyChanges = async() => {
    // Prepare your data structure based on current state
    const updatedPermissions = {
      is_active: isActiveChecked,
      blaze_product_permissions: {
        is_equity_analysis: checkedEquity,
        is_equity_orders: checkedEquityOrder,
        is_fo_analysis: checkedFutureAnalysis,
        is_fo_orders: checkedFutureOrder,
        is_monthly_status: checkedMonthlyStatus
      }
    };

    // Assuming you have a function to handle saving or applying these changes
    // You can pass updatedPermissions to that function
    console.log('Updated Permissions:', updatedPermissions);

    const newData = selectedItems.map(obj => ({
      ...obj,
      "is_active": isActiveChecked,
      "blaze_product_permissions": {
        "is_equity_analysis": checkedEquity,
        "is_equity_orders": checkedEquityOrder,
        "is_fo_analysis": checkedFutureAnalysis,
        "is_fo_orders": checkedFutureOrder,
        "is_monthly_status": checkedMonthlyStatus
      }
    }));

    const newfilterdata = filterUserData(newData)

   
    const res = await axios.patch(`${baseUrl}/user/profiles/update/multi/`,{ "users":newfilterdata}, { headers })
    // Close the modal after applying changes
    console.log("newDatanewDatanewData", newData,res)
    if(res.status == 200){
      const usersPromise = axios.get(`${baseUrl}/user/profiles/?paginate=false&?clear_cache=false`, { headers });
      const [usersRes] = await Promise.all([
        usersPromise
      ]);

      if (usersRes.status === 200) {
         setUsersData(usersRes.data.data);
        localStorage.setItem('donotCallApi', false);
      } else {
        throw new Error(`Failed to fetch users data. Status: ${usersRes.status}`);
      }
    }
    AdminCloseModal();
  };

  return (
    <>
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
          <EuiButton onClick={AdminShowModal} iconType="popout">
            Permissiions
          </EuiButton>
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

      {adminPermissionModal && (
        <EuiOverlayMask>
          <EuiModal onClose={AdminCloseModal}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>Permissions</EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
              <EuiFlexGroup direction="column">
                <EuiFlexItem>

                  <EuiSwitch
                    label="Is Active"
                    checked={isActiveChecked}
                    onChange={onChangeIsActive}
                  />

                </EuiFlexItem>
                <EuiFlexItem>

                  <EuiSwitch
                    label="Equity Analysis"
                    checked={checkedEquity}
                    onChange={onChangeEquity}
                  />

                </EuiFlexItem>
                <EuiFlexItem>

                  <EuiSwitch
                    label="Equity Order"
                    checked={checkedEquityOrder}
                    onChange={onChangeEquityOrder}
                  />

                </EuiFlexItem>
                <EuiFlexItem>

                  <EuiSwitch
                    label="Future Analysis"
                    checked={checkedFutureAnalysis}
                    onChange={onChangeFutureAnalysis}
                  />

                </EuiFlexItem>
                <EuiFlexItem>

                  <EuiSwitch
                    label="Future Order"
                    checked={checkedFutureOrder}
                    onChange={onChangeFutureOrder}
                  />

                </EuiFlexItem>
                <EuiFlexItem>

                  <EuiSwitch
                    label="Monthly Status"
                    checked={checkedMonthlyStatus}
                    onChange={onChangeMonthlyStatus}
                  />

                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiModalBody>
            <EuiModalFooter>
              <EuiButton onClick={handleApplyChanges} fill>
                Apply
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>

        </EuiOverlayMask>
      )}
      <UsersModalComponent UsersData={UsersData != undefined ? UsersData : ""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
    </>
  );
};

export default CustomTable;
