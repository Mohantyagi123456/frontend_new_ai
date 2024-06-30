import React, { useState } from 'react';
import {
  EuiButton,
  EuiFieldText,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiComboBox,
  EuiForm,
  EuiFormRow,
  EuiButtonEmpty,
  useGeneratedHtmlId,
} from '@elastic/eui';
import axios from 'axios'; // Assuming Axios for HTTP requests

const FutureStrategyGenerate = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [strategySymbolName, setStrategySymbolName] = useState([]);
  const [strategyExcludeName, setStrategyExcludeName] = useState([]);

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });
  const modalTitleId = useGeneratedHtmlId();

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSymbolChange = (selectedOptions) => {
    setStrategySymbolName(selectedOptions);
  };

  const handleExcludeChange = (selectedOptions) => {
    setStrategyExcludeName(selectedOptions);
  };

  const handleOk = async () => {
    const body = {
      symbols: strategySymbolName.map(option => option.label),
      exclude: strategyExcludeName.map(option => option.label),
      strategy_name: strategyName
    };

    if (strategyName.trim() !== "") {
      try {
        // Adjust the API endpoint and headers as per your setup
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/strategy/generate/`, body, { headers });
        if (res.status === 200) {
          setIsModalVisible(false);
          setStrategySymbolName([]);
          setStrategyExcludeName([]);
          setStrategyName('');
          // Optionally, you can perform additional actions after successful submission
        }
      } catch (error) {
        console.error("Error occurred:", error);
        // Handle error response
      }
    } else {
      // Show error message if strategy name is empty
      console.error("Strategy Name is Required");
    }
  };

  const symbols = [
    { label: 'Symbol 1' },
    { label: 'Symbol 2' },
    { label: 'Symbol 3' }
  ];

  return (
    <>
      {/* <EuiButton onClick={showModal}>Show Create Strategy Modal</EuiButton> */}

      {isModalVisible && (
        <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle id={modalTitleId}>
              Create Strategy
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiForm id={modalFormId} component="form">
              <EuiFormRow label="Strategy Name">
                <EuiFieldText
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="Enter Strategy Name"
                />
              </EuiFormRow>
              <EuiFormRow label="Symbols" helpText="Select tags for symbols"   style={{backgroundColor:"white"}}>
                <EuiComboBox
              
                  placeholder="Select symbols"
                  options={symbols}
                  selectedOptions={strategySymbolName}
                  onChange={handleSymbolChange}
                  isClearable={true}
                />
              </EuiFormRow>
              <EuiFormRow label="Exclude Symbols" helpText="Select tags for excluded symbols">
                <EuiComboBox
                  placeholder="Select symbols to exclude"
                  options={symbols}
                  selectedOptions={strategyExcludeName}
                  onChange={handleExcludeChange}
                  isClearable={true}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
            <EuiButton onClick={handleOk} fill>
              Save
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

export default FutureStrategyGenerate;
