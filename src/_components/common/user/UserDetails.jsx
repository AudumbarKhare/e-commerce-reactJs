import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import FormValidator from '../../../_validators/FormValidator';
import { CommonService } from '../../../_services/Common.Service';
import { toast } from 'react-toastify';
import DbOperation from '../../../_helpers/dbOperation';
const UserDetails = (props) => {
    const validatorReg = new FormValidator([
        { field: 'FirstName', method: 'isEmpty', validWhen: false, message: 'First Name is Required' },
        { field: 'LastName', method: 'isEmpty', validWhen: false, message: 'Last Name is Required' },
        { field: 'Email', method: 'isEmpty', validWhen: false, message: 'Email is Required' },
        { field: 'UserTypeId', method: 'isEmpty', validWhen: false, message: 'User  Type is need to select' },
        { field: 'Password', method: 'isEmpty', validWhen: false, message: 'Password is Required' },
        { field: 'ConfirmPassword', method: 'isEmpty', validWhen: false, message: 'Confirm Password is Required' },
        {
            field: 'ConfirmPassword',
            method: (confirmPassword, userInfo) => confirmPassword === userInfo.userInfo.Password,
            validWhen: true,
            message: 'Passwords do not match'
        }
    ]);
    const [userTypes, setUserTypes] = useState([]);
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState({
        Id: props.userDetails.Id || 0,
        FirstName: props.userDetails.FirstName || '',
        LastName: props.userDetails.LastName || '',
        Email: props.userDetails.Email || '',
        UserTypeId: props.userDetails.UserTypeId || '',
        Status: props.userDetails.Status || '',
        Password: '',
        ConfirmPassword: '',
        validationReg: validatorReg.valid(),
    });
    const [formValidation, setFormValidation] = useState(validatorReg.valid());
    const [isSubmitted, setIsSumitted] = useState(false);
    const [isLoading, setIsLading] = useState(false);

    useEffect(() => {

        setUserInfo((pervUserInfo) => ({
            ...pervUserInfo,
            Id: props.userDetails.Id,
            FirstName: props.userDetails.FirstName,
            LastName: props.userDetails.LastName,
            Email: props.userDetails.Email,
            UserTypeId: props.userDetails.UserTypeId,
            Status: props.userDetails.Status,
            Password: '',
            ConfirmPassword: '',
        }))
    }, [props.userDetails])

    const getAll = () => {
        setIsLading(true);
        CommonService.getAll('UserType', false).then(res => {
            if (res.isSuccess) {
                const userTypes = res.data.map(data => ({
                    label: data.name,
                    value: data.id
                }))
                setUserTypes(userTypes);
            } else {
                toast.error(res.errors[0], "Profile")
            }
        }).catch(error => {
            toast.error(`Something Went Wrong ${error}`, 'Profile')
        }).finally(() => setIsLading(false))
    }

    useEffect(() => {
        getAll();
    }, []);

    const handleChangeInput = (event) => {

        if (event && event.target) {
            const { name, value } = event.target;
            setUserInfo((prevProfile) => ({
                ...prevProfile,
                [name]: value
            }));
        } else {
            setUserInfo((prevProfile) => ({
                ...prevProfile,
                UserTypeId: event
            }));
        }
    }

    const handleUserProfile = () => {
        const validation = validatorReg.validate({ userInfo }, 'userInfo');
        setFormValidation(validation);

        if (validation.isValid) {
            setIsLading(true);
            setIsSumitted(true);
            switch (props.userDetails.Operation) {
                case DbOperation.create:
                    CommonService.save('UserMaster', false, userInfo).then(
                        (res) => {
                            if(res.isSuccess){
                            toast.success("User Profile Save Successfully !!", "Profile");
                            }else{
                            console.error(res.errors[0])
                            toast.error(res.errors[0], "User");
                            }
                        }
                    ).catch((error) => {
                        console.error(error);
                    }).finally(() => {
                        setIsLading(false);
                        setIsSumitted(false);
                    });
                    break;
                case DbOperation.update:
                    CommonService.update('UserMaster', false, userInfo).then((res) => {
                        if (res.isSuccess) {
                            toast.success("User  Profile Updated Successfully !!", "Profile");
                        } else {
                            toast.error(res.errors[0], "Profile");
                        }
                    })
                        .catch((error) => {
                            console.error("Error updating user profile:", error); // Log the error for debugging
                            toast.error(`Something went wrong: ${error.message || error}!!`, 'Profile');
                        })
                        .finally(() => {
                            setIsLading(false);
                            setIsSumitted(false);
                        })
                    break;
                default:
                    break;
            }
        }
    }

    const _validation = isSubmitted ? validatorReg.validate({ userInfo }, 'userInfo') : formValidation;

    return (
        <Spin spinning={isLoading}>
            <Form form={form} layout='vertical' onFinish={handleUserProfile} autoComplete='off' >
                <Form.Item
                    label="First Name"
                    validateStatus={_validation?.FirstName?.isInvalid ? 'error' : ''}
                    help={_validation?.FirstName?.message}
                >
                    <Input name="FirstName" value={userInfo.FirstName} placeholder='Please Enter the First Name' onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    validateStatus={_validation?.LastName?.isInvalid ? 'error' : ''}
                    help={_validation?.LastName?.message}
                >
                    <Input name="LastName" value={userInfo.LastName} placeholder='Please Enter the Last Name' onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item
                    label="Email"
                    validateStatus={_validation?.Email?.isInvalid ? 'error' : ''}
                    help={_validation?.Email?.message}
                >
                    <Input name="Email" value={userInfo.Email} placeholder='Please Enter the Email Id' onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item
                    label="User Type"
                    validateStatus={_validation?.UserTypeId?.isInvalid ? 'error' : ''}
                    help={_validation?.UserTypeId?.message}
                >
                    <Select value={userInfo.UserTypeId} name="UserType" placeholder='Select User Type' options={userTypes} onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    validateStatus={_validation?.Password?.isInvalid ? 'error' : ''}
                    help={_validation?.Password?.message}
                >
                    <Input name="Password" type='password' placeholder='Please Enter the Password' onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    validateStatus={_validation?.ConfirmPassword?.isInvalid ? 'error' : ''}
                    help={_validation?.ConfirmPassword?.message}
                >
                    <Input name="ConfirmPassword" type='password' placeholder='Please Enter the Confirm Password' onChange={handleChangeInput} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type='primary' shape='round'>{props.userDetails.btnTitle}</Button>
                    <Button shape='round'>Clare</Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}

export default UserDetails;
