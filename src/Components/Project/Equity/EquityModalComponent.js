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
    version: initialStatusData.version || '',
    trade_status: initialStatusData.trade_status || '',
    ath: initialStatusData.ath || '',
    ath_date: initialStatusData.ath_date || null,
    entry_date: initialStatusData.entry_date || null,
    // is_changed: initialStatusData.is_changed || false,
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
      <EuiFormRow label="Version">
        <EuiFieldText
          name="version"
          value={formData.version}
          onChange={(e) => handleFormChange('version', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Trade Status">
        <EuiFieldText
          name="trade_status"
          value={formData.trade_status}
          onChange={(e) => handleFormChange('trade_status', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="ATH">
        <EuiFieldText
          name="ath"
          value={formData.ath}
          onChange={(e) => handleFormChange('ath', e.target.value)}
        />
      </EuiFormRow>
      {/* <EuiFormRow label="Bull Bear Value">
        <EuiFieldNumber
          name="bull_bear_value"
          value={formData.bull_bear_value}
          onChange={(e) => handleFormChange('bull_bear_value', e.target.value)}
        />
      </EuiFormRow> */}
      <EuiFormRow label="ATH Date">
        <EuiDatePicker
          selected={formData.ath_date ? moment(formData.ath_date) : null}
          onChange={(date) => handleFormChange('ath_date', date)}
        />
      </EuiFormRow>
      <EuiFormRow label="Entry Date">
        <EuiDatePicker
          selected={formData.entry_date ? moment(formData.entry_date) : null}
          onChange={(date) => handleFormChange('entry_date', date)}
        />
      </EuiFormRow>
      {/* <EuiFormRow label="Previous Status Start Date">
        <EuiDatePicker
          selected={formData.previous_status_start_dt ? moment(formData.previous_status_start_dt) : null}
          onChange={(date) => handleFormChange('previous_status_start_dt', date)}
        />
      </EuiFormRow> */}
      {/* <EuiFormRow>
        <EuiSwitch
          id={modalFormSwitchId}
          name="is_changed"
          label="Is Changed"
          checked={formData.is_changed}
          onChange={(e) => handleFormChange('is_changed', e.target.checked)}
        />
      </EuiFormRow> */}
    </EuiForm>
  );
};

const EquityModalComponent = ({
  isModalUpdateVisible,
  setIsModalUpdateVisible,
  closeUpdateModal,
  showUpdateModal,
  statusData
}) => {
  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });
  const modalTitleId = useGeneratedHtmlId();

  const handleSave = (formData) => {
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
             Equity Details of {statusData.symbol}
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

export default EquityModalComponent;
