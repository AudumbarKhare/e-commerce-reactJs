import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CommonService } from '../../_services/Common.Service';
import DbOperation from '../../_helpers/dbOperation';
import { Form, Input, Select, Button } from 'antd';
import withNavigate from '../../_helpers/WithNavigate';
import withLocation from '../../_helpers/WithLocation';

const { Option } = Select;

const AddUser = (props) => {
  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState("Save");
  const [userTypes, setUserTypes] = useState([]); 
  const [form] = Form.useForm(); // Initialize form instance

  useEffect(() => {
    getUserTypes();
    if (props.location.state && props.location.state.objRow) {
      fillData(props.location.state.objRow);
    }
  }, [props.location.state]);

  const fillData = (data) => {
    setDbops(DbOperation.update);
    setBtnText("Update");
    form.setFieldsValue({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userTypeId: data.userTypeId,
      password: '',
      confirmPassword: ''
    });
  };

  const clearRegForm = () => {
    setDbops(DbOperation.create);
    setBtnText("Save");
    form.resetFields();
  };

  const getUserTypes = () => {
    CommonService.getAll("UserType", false)
      .then(
        res => {
          if (res.isSuccess) {
            setUserTypes(res.data || []); 
          } else {
            toast.error(res.errors[0], "User Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "User Master");
        }
      );
  };

  const handleSubmit = (values) => {
    if (dbops === DbOperation.create) {
      CommonService.save("UserMaster", false, values)
        .then(
          res => {
            if (res.isSuccess) {
              if (res.data === -1) {
                toast.warning("EmailId already exists !!", "Add User");
              } else {
                toast.success("User has been added successfully !!", "Add User");
                clearRegForm();
              }
            } else {
              toast.error(res.errors[0], "Add User");
            }
          },
          () => {
            toast.error("Something Went Wrong !!", "Add User");
          }
        );
    } else if (dbops === DbOperation.update) {
      CommonService.update("UserMaster", false, values)
        .then(
          res => {
            if (res.isSuccess) {
              if (res.data === -1) {
                toast.warning("EmailId already exists !!", "Add User");
              } else {
                toast.success("User data has been updated successfully !!", "Add User");
                clearRegForm();
              }
            } else {
              toast.error(res.errors[0], "Add User");
            }
          },
          () => {
            toast.error("Something Went Wrong !!", "Add User");
          }
        );
    }
  };

  const handleCancel = () => {
    props.navigate('/users/list-user');
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h5>Add User</h5>
              </div>
              <div className="card-body">
                <Form
                  form={form} // Bind the form instance
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={form.getFieldsValue()}
                >
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'First Name is required' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Last Name is required' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Email Id is required' },
                      { type: 'email', message: 'Please enter a valid email id' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="userTypeId"
                    label="User Type"
                    rules={[{ required: true, message: 'User Type is required' }]}
                  >
                    <Select placeholder="--Select User Type--">
                      {userTypes.length > 0 ? (
                        userTypes.map((value) => (
                          <Option key={value.id} value={value.id}>
                            {value.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No User Types Available</Option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Password is required' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Confirm Password is required' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <div className="form-button">
                    <Button type="primary" htmlType="submit" className="me-2">
                      {btnText}
                    </Button>
                    <Button type="default" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default withNavigate(withLocation(AddUser));
