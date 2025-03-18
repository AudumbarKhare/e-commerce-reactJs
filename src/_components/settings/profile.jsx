import { FacebookFilled, GoogleOutlined, MailOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Row, Col, Typography, Tabs, Upload, Button, Form, Spin } from 'antd';
import React, { useState } from 'react';
import UserImage from '../../assets/user.png';
import './settings.css';
import { connect } from 'react-redux';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import UserDetails from '../common/user/UserDetails';
import DbOperation from '../../_helpers/dbOperation';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = (props) => {
    const userInfo = {
        Id: props.user.userDetails.id || 0,
        FirstName: props.user.userDetails.firstName || '',
        LastName: props.user.userDetails.lastName || '',
        Email: props.user.userDetails.email || '',
        UserTypeId: props.user.userDetails.userTypeId || '',
        Status: props.user.userDetails.status || '',
        Password: '',
        ConfirmPassword: '',
        btnTitle: 'Update',
        Operation: DbOperation.update
    };

    const [imageInfo, setImageInfo] = useState({ image: '' });
    const [imageUrl, setImageUrl] = useState(props.user.userDetails.imagePath || UserImage);
    const [isLoading, setIsLading] = useState(false);

    const handleFileChange = (info) => {
        const file = info.file;
        if (!file) {
            return;
        }
        const type = file.type;
        if (type.match(/image\/*/) == null) {
            toast.error("Only images are supported here!", "Profile");
            return;
        }
        setImageInfo((prevImage) => ({
            ...prevImage,
            image: file
        }));
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const handleUpdateProfilImage = () => {
        if (Object.keys(imageInfo.image).length === 0) {
            toast.error("Please Upload The New Image");
            return;
        }
        let formData = new FormData();
        formData.append("Id", props.user.userDetails.id);
        console.log(imageInfo)
        formData.append("Image", imageInfo.image, imageInfo.image.name);
        setIsLading(true);
        CommonService.updateProfile('UserMaster', true, formData).then(
            (res) => {
                if (res.isSuccess) {
                    toast.success("Profile Image Update Successfully", "Profile")
                } else {
                    toast.error(res.errors[0], "Profile")
                }
            }).catch((error) => {
                console.error("Error updating user profile:", error);
                toast.error(`Something went wrong: ${error.message || error}!!`, 'Profile');
            })
            .finally(() => {
                setIsLading(false);
            })
    }
    return (
        <Row gutter={16}>
            <Col span={8} style={{ display: 'flex', alignContent: 'center', textAlign: 'center' }}>
                <Card style={{ width: '100%', margin: '0 auto', height: '260px' }}>
                    <div>
                        <div>
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                src={imageUrl}
                                style={{ backgroundColor: '#87d068' }}
                            />
                            <Title level={4}>{userInfo.FirstName} {userInfo.LastName}</Title>
                            <Text type='secondary'>{userInfo.Email}</Text>
                        </div>
                        <div>
                            <MailOutlined className='icons' />
                            <FacebookFilled className='icons' />
                            <GoogleOutlined className='icons' />
                            <TwitterOutlined className='icons' />
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span={16}>
                <Card>
                    <Tabs defaultActiveKey='info' tabPosition='top'>
                        <TabPane tab='User Details' key='info'>
                            <Title level={4}>Profile</Title>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Text>Name :-</Text><br /><br />
                                    <Text>Last :-</Text><br /><br />
                                    <Text>Email :-</Text><br />
                                </Col>
                                <Col span={18}>
                                    <Text>{userInfo.FirstName}</Text><br /><br />
                                    <Text>{userInfo.LastName}</Text><br /><br />
                                    <Text>{userInfo.Email}</Text><br />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab='Edit User Details' key='editUserDetails'>
                            <UserDetails userDetails={userInfo} />
                        </TabPane>
                        <TabPane tab='Upload Image' key='uploadimage'>
                            <Spin spinning={isLoading}>
                                <div style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
                                    <div style={{ marginBottom: 24 }}>
                                        <Avatar
                                            size={150}
                                            icon={<UserOutlined />}
                                            src={imageUrl}
                                            style={{ backgroundColor: '#87d068' }}
                                        />
                                    </div>
                                    <Title level={4}>Upload Image</Title>
                                    <div>
                                        <Form onFinish={handleUpdateProfilImage}>
                                            <Upload
                                                beforeUpload={() => false}
                                                onChange={handleFileChange}
                                                accept='image/*'
                                                showUploadList={false}
                                                name='image'
                                            >
                                                <Button shape='round' icon={<UploadOutlined />}>Chanage Image</Button>
                                            </Upload>
                                            <Button htmlType='submit' type='primary' disabled={!imageUrl} shape='round'>
                                                Update
                                            </Button>
                                        </Form>
                                    </div>

                                </div>
                            </Spin>
                        </TabPane>
                    </Tabs>
                </Card>
            </Col>
            <ToastContainer />
        </Row>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(Profile);
