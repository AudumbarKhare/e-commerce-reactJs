import React from 'react';
import { Layout, Menu, theme, Flex, Avatar, Dropdown } from 'antd';
import shopLogo from '../../../assets/Shop Logo.png';
import UserImage from '../../../assets/user.png';
import { Link, useNavigate } from 'react-router-dom';
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
                <Link to={'/settings/profile'}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to={'/settings'}>Settings</Link>
            </Menu.Item>
            <Menu.Item key="3">
            <Link to={'/logout'}>Logout</Link>
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
                    <Avatar size="large" src={(props.user.userDetails.imagePath != null && props.user.userDetails.imagePath != "")
                ? props.user.userDetails.imagePath : UserImage} />
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
