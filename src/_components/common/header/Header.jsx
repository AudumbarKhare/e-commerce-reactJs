import React from 'react';
import { Layout, Menu, theme, Flex, Avatar, Dropdown } from 'antd';
import shopLogo from '../../../assets/Shop Logo.png';
import UserImage from '../../../assets/user.png'
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Global from '../../../_helpers/BasePath';

const { Header } = Layout;

const Headers = (props) => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const logout = () => {
        localStorage.clear();
        props.setLoggedIn(false, {});
        navigate('/auth/login');
    }

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <a href="/profile">Profile</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="/settings">Settings</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="/logout" onClick={logout}>Logout</a>
            </Menu.Item>
        </Menu>
    );
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                background: colorBgContainer,
            }}
        >
            <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                <Avatar src={shopLogo} width={500} style={{ height: '50px', width: '50px', borderRadius: 0 }} />
                <Dropdown overlay={menu} trigger={['click']}>
                    <Avatar size="large" src={(props.user.userDetails.imagepath != null && props.user.userDetails.imagepath != "")
                ? Global.BASE_USER_IMAGES_PATH + props.user.userDetails.imagepath : UserImage} />
                </Dropdown>
            </Flex>

        </Header>
    )
}

const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}

export default connect(mapStateToProps)(Headers);
