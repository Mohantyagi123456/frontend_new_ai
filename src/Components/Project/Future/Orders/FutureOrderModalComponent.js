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
    name: initialordersData.name || '',
    strategy_name: initialordersData.strategy_name || '',
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
          name="name"
          value={formData.name}
          onChange={(e) => handleFormChange('name', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="strategy_name">
        <EuiFieldText
          name="strategy_name"
          value={formData.strategy_name}
          onChange={(e) => handleFormChange('strategy_name', e.target.value)}
        />
      </EuiFormRow>
      <EuiFormRow label="Trigger">
        <EuiFieldText
          name="trigger"
          value={formData.trigger}
          onChange={(e) => handleFormChange('trigger', e.target.value)}
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

const FutureOrderModalComponent = ({
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
          initialFocus="[name=name]"
        >
          <EuiModalHeader >
            <EuiModalHeaderTitle id={modalTitleId} className='moadlHeading'>
             F&O Details of {ordersData.name}
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

export default FutureOrderModalComponent;
