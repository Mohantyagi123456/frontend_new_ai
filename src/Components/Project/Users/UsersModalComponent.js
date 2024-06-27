import React, { useState, useEffect } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiFieldNumber,
  EuiDatePicker,
  EuiSwitch,
  useGeneratedHtmlId,
} from '@elastic/eui';
import moment from 'moment';

const ExampleForm = ({ id, initialUsersData, handleSave, handleCancel }) => {
    console.log("initialUsersData",initialUsersData)
  const [formData, setFormData] = useState({
    full_name: initialUsersData.full_name || '',
    email: initialUsersData.email || '',
    pan_card: initialUsersData.pan_card || '',
    aadhaar_card: initialUsersData.aadhaar_card || '',
    date_joined: initialUsersData.date_joined || null,
    previous_status_start_dt: initialUsersData.previous_status_start_dt || null,
    is_active: initialUsersData.is_active || false,
  });

  const handleFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  const modalFormSwitchId = useGeneratedHtmlId({ prefix: 'modalFormSwitch' });

  return (
    <EuiForm id={id} component="form" onSubmit={handleSubmit}>
      <EuiFormRow label="FullName">
        <EuiFieldText
          name="full_name"
          value={formData.full_name}
          onChange={(e) => handleFormChange('full_name', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="FullName">
        <EuiFieldText
          name="email"
          value={formData.email}
          onChange={(e) => handleFormChange('email', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="PanCard">
        <EuiFieldText
          name="pan_card"
          value={formData.pan_card}
          onChange={(e) => handleFormChange('pan_card', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Aadhaar Card">
        <EuiFieldText
          name="aadhaar_card"
          value={formData.aadhaar_card}
          onChange={(e) => handleFormChange('aadhaar_card', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Joining Date">
        <EuiDatePicker
          selected={formData.date_joined ? moment(formData.date_joined) : null}
          onChange={(date) => handleFormChange('date_joined', date)}
        />
      </EuiFormRow>
      <EuiFormRow>
        <EuiSwitch
          id={modalFormSwitchId}
          name="is_active"
          label="Is Active"
          checked={formData.is_active}
          onChange={(e) => handleFormChange('is_active', e.target.checked)}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

const UsersModalComponent = ({
  isModalUpdateVisible,
  setIsModalUpdateVisible,
  closeUpdateModal,
  showUpdateModal,
  UsersData
}) => {
  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });
  const modalTitleId = useGeneratedHtmlId();

  const handleSave = (formData) => {
    console.log('Saved data', formData);
    closeUpdateModal();
  };

  const handleCancel = () => {
    closeUpdateModal();
  };

  return (
    <>
      {isModalUpdateVisible && (
        <EuiModal
          className='modalUpdate'
          aria-labelledby={modalTitleId}
          onClose={closeUpdateModal}
          initialFocus="[name=symbol]"
        >
          <EuiModalHeader >
            <EuiModalHeaderTitle id={modalTitleId} className='moadlHeading'>
              User Details of {UsersData.full_name}
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <ExampleForm
              id={modalFormId}
              initialUsersData={UsersData}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={handleCancel}>Cancel</EuiButtonEmpty>
            <EuiButton
              type="submit"
              form={modalFormId}
              onClick={handleSave}
              fill
            >
              Save
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

export default UsersModalComponent;
