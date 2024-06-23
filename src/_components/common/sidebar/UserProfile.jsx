import React from 'react';
import { Avatar, Typography } from 'antd';
import UserImage from '../../../assets/audu.jpg';

const { Text } = Typography;

const UserProfile = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Avatar size="large" src={UserImage} />
            <div style={{ marginTop: '10px' }}>
                <Text strong style={{ display: 'block', color: '#ff7875' }}>Audumbar Dagadu Khare</Text>
                <Text type="secondary">Developer</Text>
            </div>
        </div>
    )
}

export default UserProfile;
