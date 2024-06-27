import React, { useState } from 'react';
import {
    EuiButton,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiSpacer,
    EuiSelect,
} from '@elastic/eui';
import axios from 'axios';

const ModalComponent = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    const KiteId = JSON.parse(localStorage.getItem('userData'));
    const headers = {
        'Authorization': `Bearer ${KiteId?.access}`
    };

    const [formData, setFormData] = useState({
        totalCapital: null,
        fundsAddedThisMonth: null,
        totalInvestmentValue: null,
        totalPortfolioCurrentValue: null,
        fixedOnTotalCapitalDcc: null,
        fixedOnTotalCapitalWcc: null,
        fixedOnTotalCapitalMcc: null,
        riskPerStock: null,
        selectedStocks: [],
    });

    const { 
        totalCapital,
        fundsAddedThisMonth,
        totalInvestmentValue,
        totalPortfolioCurrentValue,
        fixedOnTotalCapitalDcc,
        fixedOnTotalCapitalWcc,
        fixedOnTotalCapitalMcc,
        riskPerStock,
        selectedStocks
    } = formData;

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value !== '' ? value : null,
        });
    };

    const handleStockChange = (values) => {
        const selected = stocksDetails.filter(stock => values.includes(stock.symbol));
        setFormData({
            ...formData,
            selectedStocks: selected,
        });
    };

    const handleSubmit = () => {
        // Parse numeric fields from strings
        const parsedFormData = {
            totalCapital: parseFloat(totalCapital),
            fundsAddedThisMonth: parseFloat(fundsAddedThisMonth),
            totalInvestmentValue: parseFloat(totalInvestmentValue),
            totalPortfolioCurrentValue: parseFloat(totalPortfolioCurrentValue),
            fixedOnTotalCapitalDcc: parseFloat(fixedOnTotalCapitalDcc),
            fixedOnTotalCapitalWcc: parseFloat(fixedOnTotalCapitalWcc),
            fixedOnTotalCapitalMcc: parseFloat(fixedOnTotalCapitalMcc),
            riskPerStock: parseFloat(riskPerStock),
            selectedStocks: selectedStocks.map(stock => ({
                symbol: stock.symbol,
                entry_price: parseFloat(stock.entry_price),
                is_monthly: stock.is_monthly
            }))
        };
    
        const capitalDetails = {
            total_capital: parsedFormData.totalCapital,
            funds_added_this_month: parsedFormData.fundsAddedThisMonth,
            total_investment_value: parsedFormData.totalInvestmentValue,
            total_portfolio_current_value: parsedFormData.totalPortfolioCurrentValue,
            fixed_on_total_capital_dcc: parsedFormData.fixedOnTotalCapitalDcc,
            fixed_on_total_capital_wcc: parsedFormData.fixedOnTotalCapitalWcc,
            fixed_on_total_capital_mcc: parsedFormData.fixedOnTotalCapitalMcc,
            risk_per_stock: parsedFormData.riskPerStock
        };
    
        const postData = {
            capital_details: capitalDetails,
            stocks_details: selectedStocks
        };
    
        axios.post(`${process.env.REACT_APP_BASE_URL}/main/stocks/quantity/`, postData, { headers })
            .then(response => {
                if (response.data.status === 200) {
                    // Handle success (optional)
                    console.log('Form submitted successfully:', response.data);
                    closeModal(); // Close modal after successful submission if desired
                    resetForm(); // Clear form fields and selected stocks
    
                    // Assuming the API response contains updated data with 'qty' field
                    const updatedData = response.data
    
                    // Pass the updated data back to the parent component
                    if (props.onDataUpdate) {
                        props.onDataUpdate(updatedData?.data);
                    }
                } else {
                    console.error('Error:', response.data.message);
                    // Handle error scenarios
                }
            })
            .catch(error => {
                console.error('There was an error submitting the form!', error);
                // Handle error scenarios
            });
    };
    
    

    const resetForm = () => {
        setFormData({
            totalCapital: null,
            fundsAddedThisMonth: null,
            totalInvestmentValue: null,
            totalPortfolioCurrentValue: null,
            fixedOnTotalCapitalDcc: null,
            fixedOnTotalCapitalWcc: null,
            fixedOnTotalCapitalMcc: null,
            riskPerStock: null,
            selectedStocks: [],
        });
    };

    const stocksDetails = [
        { symbol: 'RIL', entry_price: 2900.4, is_monthly: true },
        { symbol: 'HDFC', entry_price: 1400.0, is_monthly: false }
        // Add more stock details as needed
    ];

    return (
        <>
            <EuiButton onClick={showModal}>Risk Management Modal</EuiButton>
            {isModalVisible && (
                <EuiModal onClose={closeModal} initialFocus="[name=popfirst]">
                    <EuiModalHeader>
                        <EuiModalHeaderTitle>Risk Management</EuiModalHeaderTitle>
                    </EuiModalHeader>
                    <EuiModalBody>
                        <EuiForm component="form">
                            <EuiFormRow label="Total Capital">
                                <EuiFieldNumber
                                    placeholder="Total Capital"
                                    value={totalCapital !== null ? totalCapital : ''}
                                    onChange={(e) => handleInputChange('totalCapital', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Funds Added This Month">
                                <EuiFieldNumber
                                    placeholder="Funds Added This Month"
                                    value={fundsAddedThisMonth !== null ? fundsAddedThisMonth : ''}
                                    onChange={(e) => handleInputChange('fundsAddedThisMonth', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Total Investment Value">
                                <EuiFieldNumber
                                    placeholder="Total Investment Value"
                                    value={totalInvestmentValue !== null ? totalInvestmentValue : ''}
                                    onChange={(e) => handleInputChange('totalInvestmentValue', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Total Portfolio Current Value">
                                <EuiFieldNumber
                                    placeholder="Total Portfolio Current Value"
                                    value={totalPortfolioCurrentValue !== null ? totalPortfolioCurrentValue : ''}
                                    onChange={(e) => handleInputChange('totalPortfolioCurrentValue', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Fixed on Total Capital DCC">
                                <EuiFieldNumber
                                    placeholder="Fixed on Total Capital DCC"
                                    value={fixedOnTotalCapitalDcc !== null ? fixedOnTotalCapitalDcc : ''}
                                    onChange={(e) => handleInputChange('fixedOnTotalCapitalDcc', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Fixed on Total Capital WCC">
                                <EuiFieldNumber
                                    placeholder="Fixed on Total Capital WCC"
                                    value={fixedOnTotalCapitalWcc !== null ? fixedOnTotalCapitalWcc : ''}
                                    onChange={(e) => handleInputChange('fixedOnTotalCapitalWcc', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Fixed on Total Capital MCC">
                                <EuiFieldNumber
                                    placeholder="Fixed on Total Capital MCC"
                                    value={fixedOnTotalCapitalMcc !== null ? fixedOnTotalCapitalMcc : ''}
                                    onChange={(e) => handleInputChange('fixedOnTotalCapitalMcc', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Risk Per Stock">
                                <EuiFieldNumber
                                    placeholder="Risk Per Stock"
                                    value={riskPerStock !== null ? riskPerStock : ''}
                                    onChange={(e) => handleInputChange('riskPerStock', e.target.value)}
                                />
                            </EuiFormRow>
                            <EuiFormRow label="Stock Symbols">
                                <EuiSelect
                                    className="small-input"
                                    size="s"
                                    options={stocksDetails.map(stock => ({ value: stock.symbol, text: stock.symbol }))}
                                    onChange={(e) => handleStockChange(e.target.value)}
                                    value={selectedStocks.map(stock => stock.symbol)}
                                    placeholder="Select stocks"
                                    isMulti
                                />
                            </EuiFormRow>
                        </EuiForm>
                        <EuiSpacer />
                    </EuiModalBody>
                    <EuiModalFooter>
                        <EuiButton onClick={handleSubmit} fill>
                            Submit
                        </EuiButton>
                        <EuiButton onClick={closeModal}>
                            Cancel
                        </EuiButton>
                    </EuiModalFooter>
                </EuiModal>
            )}
        </>
    );
};

export default ModalComponent;
