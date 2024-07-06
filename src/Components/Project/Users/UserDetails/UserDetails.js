import React, { useState } from 'react';
import {
    EuiSpacer,
    formatDate,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiPageSection,
    EuiFlexItem,
    EuiButton,
    EuiImage

} from '@elastic/eui';
import { useNavigate, useLocation } from 'react-router-dom';
import UsersModalComponent from '../UsersModalComponent';

const UserDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const closeUpdateModal = () => setIsModalUpdateVisible(false);
    const showUpdateModal = () => setIsModalUpdateVisible(true);
    console.log("kkkkkkk", location?.state)
    const [user, setUser] = useState(location?.state)

    const updateStatusDetails=()=>{
        showUpdateModal()
      }
    return (
        <>
            <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="success"
                        size="s"
                        onClick={() => navigate("/all-users")}
                    >
                        Back
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiPageSection
                restrictWidth="75%"
                color="subdued"
                bottomBorder="extended"
            >
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiImage
                            size="m"
                            hasShadow
                            allowFullScreen
                            caption={user.full_name}
                            alt="https://images.unsplash.com/photo-1477747219299-60f95c811fef?w=1000&h=1000&fit=crop&q=60"
                            src="https://images.unsplash.com/photo-1477747219299-60f95c811fef?w=1000&h=1000&fit=crop&q=60"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <p style={{ fontWeight: "600" }}>Full Name: <span style={{ fontWeight: "300" }}>{user.full_name}</span></p>
                        <p style={{ fontWeight: "600" }}>UserName: <span style={{ fontWeight: "300" }}>{user.username}</span></p>
                        <p style={{ fontWeight: "600" }}>Email: <span style={{ fontWeight: "300" }}>{user.email}</span></p>
                        <p style={{ fontWeight: "600" }}>Aadhar Card: <span style={{ fontWeight: "300" }}>{user.aadhaar_card}</span></p>
                        <p style={{ fontWeight: "600" }}>Pan Card: <span style={{ fontWeight: "300" }}>{user.pan_card}</span></p>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <p style={{ fontWeight: "600" }}>House No.: <span style={{ fontWeight: "300" }}>{user?.address?.house_num}</span></p>
                        <p style={{ fontWeight: "600" }}>City: <span style={{ fontWeight: "300" }}>{user?.address?.city}</span></p>
                        <p style={{ fontWeight: "600" }}>Street: <span style={{ fontWeight: "300" }}>{user?.address?.street}</span></p>
                        <p style={{ fontWeight: "600" }}>Pincode: <span style={{ fontWeight: "300" }}>{user?.address?.pincode}</span></p>
                        <p style={{ fontWeight: "600" }}>Mobile: <span style={{ fontWeight: "300" }}>+91{user?.contact?.contact}</span></p>
                    </EuiFlexItem>
                    <EuiButtonIcon display="base" onClick={()=>updateStatusDetails()} iconType="pencil" size="xs" aria-label="Next"/>
                </EuiFlexGroup>
                <UsersModalComponent UsersData={user != undefined?user:""} isModalUpdateVisible={isModalUpdateVisible} setIsModalUpdateVisible={setIsModalUpdateVisible} closeUpdateModal={closeUpdateModal} showUpdateModal={showUpdateModal} />
            </EuiPageSection>
            <EuiPageSection >

            </EuiPageSection>
        </>
    )
}

export default UserDetails