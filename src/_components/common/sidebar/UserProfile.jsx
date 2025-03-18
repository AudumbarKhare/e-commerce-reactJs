import React from 'react';
import { Avatar, Typography } from 'antd';
import UserImage from '../../../assets/user.png';
import { connect } from 'react-redux';
import Global from '../../../_helpers/BasePath';

const { Text } = Typography;

const UserProfile = (props) => {
    return (
        <div style={{ textAlign: 'center', padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Avatar size="large" src={(props.user.userDetails.imagePath != null && props.user.userDetails.imagePath != "")
                ? props.user.userDetails.imagePath : UserImage} />
            <div style={{ marginTop: '10px' }}>
                <Text strong style={{ display: 'block', color: '#ff7875' }}>{`${props.user.userDetails.firstName} ${props.user.userDetails.lastName}`}</Text>
                <Text type="secondary">{props.user.userDetails.email}</Text>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(UserProfile);
