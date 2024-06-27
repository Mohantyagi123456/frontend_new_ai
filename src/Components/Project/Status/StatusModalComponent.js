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

const ExampleForm = ({ id, initialStatusData, handleSave, handleCancel }) => {
  const [formData, setFormData] = useState({
    symbol: initialStatusData.symbol || '',
    LTP: initialStatusData.LTP || '',
    current_status: initialStatusData.current_status || '',
    previous_status: initialStatusData.previous_status || '',
    bull_bear_value: initialStatusData.bull_bear_value || '',
    current_status_start_dt: initialStatusData.current_status_start_dt || null,
    previous_status_start_dt: initialStatusData.previous_status_start_dt || null,
    is_changed: initialStatusData.is_changed || false,
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
      <EuiFormRow label="Symbol">
        <EuiFieldText
          name="symbol"
          value={formData.symbol}
          onChange={(e) => handleFormChange('symbol', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="LTP">
        <EuiFieldNumber
          name="LTP"
          value={formData.LTP}
          onChange={(e) => handleFormChange('LTP', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Current Status">
        <EuiFieldText
          name="current_status"
          value={formData.current_status}
          onChange={(e) => handleFormChange('current_status', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Previous Status">
        <EuiFieldText
          name="previous_status"
          value={formData.previous_status}
          onChange={(e) => handleFormChange('previous_status', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Bull Bear Value">
        <EuiFieldNumber
          name="bull_bear_value"
          value={formData.bull_bear_value}
          onChange={(e) => handleFormChange('bull_bear_value', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Current Status Start Date">
        <EuiDatePicker
          selected={formData.current_status_start_dt ? moment(formData.current_status_start_dt) : null}
          onChange={(date) => handleFormChange('current_status_start_dt', date)}
        />
      </EuiFormRow>
      <EuiFormRow label="Previous Status Start Date">
        <EuiDatePicker
          selected={formData.previous_status_start_dt ? moment(formData.previous_status_start_dt) : null}
          onChange={(date) => handleFormChange('previous_status_start_dt', date)}
        />
      </EuiFormRow>
      <EuiFormRow>
        <EuiSwitch
          id={modalFormSwitchId}
          name="is_changed"
          label="Is Changed"
          checked={formData.is_changed}
          onChange={(e) => handleFormChange('is_changed', e.target.checked)}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

const StatusModalComponent = ({
  isModalUpdateVisible,
  setIsModalUpdateVisible,
  closeUpdateModal,
  showUpdateModal,
  statusData
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
              Monthly Status Details of {statusData.symbol}
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <ExampleForm
              id={modalFormId}
              initialStatusData={statusData}
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

export default StatusModalComponent;
