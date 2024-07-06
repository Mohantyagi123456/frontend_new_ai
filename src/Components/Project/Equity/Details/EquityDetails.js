import React, { useState } from 'react';
import {
    EuiSpacer,
    formatDate,
    EuiPageHeader,
    EuiFlexGroup,
    EuiPageSection,
    EuiFlexItem,
    EuiPageBody,
    EuiButton,
    EuiBasicTable,
    EuiLink,
    EuiHealth,
} from '@elastic/eui';
import { useNavigate, useLocation } from 'react-router-dom';

const EquityDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [equityDetails, setEquityDetails] = useState(location?.state);
    const entriesData = equityDetails?.entries || [];
    const stoplossesData = equityDetails?.stoplosses || [];
    const targetsData = equityDetails?.targets || [];
    const finalTableData = [...entriesData, ...stoplossesData, ...targetsData];

    const columns = [
        {
            field: 'name',
            name: 'Name',
            sortable: true,
        },
        {
            field: 'status',
            name: 'Status',
            render: (status) => (
                <EuiHealth color={status === 'active' ? 'success' : 'subdued'}>
                    {status}
                </EuiHealth>
            ),
        },
        {
            field: 'created',
            name: 'Created',
            render: (created) => formatDate(created),
        },
        {
            field: 'trigger',
            name: 'Trigger',
        },
        {
            field: 'modified',
            name: 'Modified',
            render: (modified) => formatDate(modified),
        },
    ];

    const [tableData, setTableData] = useState(finalTableData);

    return (
        <>
            <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="success"
                        size="s"
                        onClick={() => navigate("/equity")}
                    >
                        Back
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiPageHeader
                paddingSize="l"
                pageTitle={equityDetails.symbol}
            />
            <EuiPageSection
                restrictWidth="75%"
                color="subdued"
                bottomBorder="extended"
            >
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <p style={{ fontWeight: "600" }}>Symbol: <span style={{ fontWeight: "300" }}>{equityDetails.symbol}</span></p>
                        <p style={{ fontWeight: "600" }}>Instrument Token: <span style={{ fontWeight: "300" }}>{equityDetails.instrument_token}</span></p>
                        <p style={{ fontWeight: "600" }}>Exchange Token: <span style={{ fontWeight: "300" }}>{equityDetails.exchange_token}</span></p>
                        <p style={{ fontWeight: "600" }}>Version: <span style={{ fontWeight: "300" }}>{equityDetails.version}</span></p>
                        <p style={{ fontWeight: "600" }}>Status: <span style={{ fontWeight: "300" }}>{equityDetails.status}</span></p>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <p style={{ fontWeight: "600" }}>Processing Status: <span style={{ fontWeight: "300" }}>{equityDetails.processing_status}</span></p>
                        <p style={{ fontWeight: "600" }}>Last Run Date: <span style={{ fontWeight: "300" }}>{formatDate(equityDetails.last_run_dt)}</span></p>
                        <p style={{ fontWeight: "600" }}>Trade Status: <span style={{ fontWeight: "300" }}>{equityDetails.trade_status}</span></p>
                        <p style={{ fontWeight: "600" }}>Modified At: <span style={{ fontWeight: "300" }}>{formatDate(equityDetails.modified_at)}</span></p>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiPageSection>
            <EuiPageSection >
                <EuiBasicTable
                    items={tableData}
                    columns={columns}
                    tableLayout="auto"
                    pagination={true}
                />
            </EuiPageSection>
        </>
    );
}

export default EquityDetails;
