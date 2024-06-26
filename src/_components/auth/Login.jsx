import React from 'react';
import { Card, Flex, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import LoginFrom from './LoginFrom';
import RegistrationFrom from './RegistrationFrom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const {TabPane} = Tabs;
const boxStyle = {
    width: '100%',
    height: '100vh',
  };

const Login = () => {
    return (
        <>
            <Flex style={boxStyle} justify='center' align='center'>
                <Card bordered={false} style={{ width: 600 }}>
                   <Tabs defaultActiveKey='1'>
                   <TabPane tab="Login" icon={<UserOutlined />} key="1">
                       <LoginFrom />
                   </TabPane>
                   <TabPane tab="Register" icon={<LockOutlined />} key="2">
                        <RegistrationFrom />
                   </TabPane>
                   </Tabs>
                </Card>
            </Flex>
            <ToastContainer />
        </>
    )
}

export default Login;
