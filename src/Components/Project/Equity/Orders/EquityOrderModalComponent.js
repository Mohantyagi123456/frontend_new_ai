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

const ExampleForm = ({ id, initialordersData, handleSave, handleCancel }) => {
  const [formData, setFormData] = useState({
    trading_symbol: initialordersData.trading_symbol || '',
    version: initialordersData.version || '',
    trigger: initialordersData.trigger || '',
    order_type: initialordersData.order_type || '',
    triggered_at: initialordersData.triggered_at || null,
    created_at: initialordersData.created_at || null,
    modified_at: initialordersData.modified_at || null,
    // is_changed: initialordersData.is_changed || false,
  });

  console.log("formDataformData",formData)

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
      <EuiFormRow label="Name">
        <EuiFieldText
          name="trading_symbol"
          value={formData.trading_symbol}
          onChange={(e) => handleFormChange('trading_symbol', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Version">
        <EuiFieldText
          name="version"
          value={formData.version}
          onChange={(e) => handleFormChange('version', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Order Type">
        <EuiFieldText
          name="order_type"
          value={formData.order_type}
          onChange={(e) => handleFormChange('order_type', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Triggered Date">
        <EuiDatePicker
          selected={formData.triggered_at ? moment(formData.triggered_at) : null}
          onChange={(date) => handleFormChange('triggered_at', date)}
        />
      </EuiFormRow>
      <EuiFormRow label="Created Date">
        <EuiDatePicker
          selected={formData.created_at ? moment(formData.created_at) : null}
          onChange={(date) => handleFormChange('created_at', date)}
        />
      </EuiFormRow>
      <EuiFormRow label="Modified_at">
        <EuiDatePicker
          selected={formData.modified_at ? moment(formData.modified_at) : null}
          onChange={(date) => handleFormChange('modified_at', date)}
        />
      </EuiFormRow>
    
    </EuiForm>
  );
};

const EquityOrderModalComponent = ({
  isModalUpdateVisible,
  setIsModalUpdateVisible,
  closeUpdateModal,
  showUpdateModal,
  ordersData
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
             Equity Details of {ordersData.symbol}
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <ExampleForm
              id={modalFormId}
              initialordersData={ordersData}
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

export default EquityOrderModalComponent;
