import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import DbOperation from '../../_helpers/dbOperation';
import getColumns from '../common/table/genColumns';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import { Row, Spin, Col, Button, Form, Input } from 'antd';
import { Tables } from '../common/table/Tables';
import DynamicModal from '../common/DynamicModal';

const UserType = () => {
  const validatorForm = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'User Type Name is reqired',
    }
  ]);

  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState('Save');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState({ id: 0, name: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formValidation, setFormValidation] = useState(validatorForm.valid())
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserType((pevUserType) => ({
      ...pevUserType,
      [name]: value
    }))
  };

  const clearForm = () => {
    setDbops(DbOperation.create);
    setBtnText('Save');
    setUserType({ id: 0, name: '' });
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  };

  const handleSubmit = () => {
    const validation = validatorForm.validate({ userType }, 'userType');
    setFormValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {
      setLoading(true);
      switch (dbops) {
        case DbOperation.create:
          CommonService.save('UserType', false, userType).then(
            (res) => {
              if (res.isSuccess) {
                toast.success('Data has been saved successfully !!', 'UserType Master');
                clearForm();
                setOpen(false);
                getData();
              } else {
                toast.error(res.errors[0], 'UserType Master');
              }
            },
            () => {
              toast.error('Something went wrong !!', 'UserType Master');
            }
          ).finally(() => setLoading(false));
          break;
        case DbOperation.update:
          CommonService.update('UserType', false, userType).then(
            (res) => {
              if (res.isSuccess) {
                toast.success('Data has been updated Successfully !!', 'UserType Master');
                clearForm();
                getData();
                setOpen(false);
              } else {
                toast.error(res.errors[0], 'UserType Master');
              }
            },
            () => {
              toast.error('Something went wrong !!', 'UserType Master');
            }
          ).finally(() => setLoading(false));
          break;
        default:
          break;
      }
    }
  };

  const getData = () => {
    setLoading(true);
    CommonService.getAll('UserType', false).then(
      (res) => {
        if (res.isSuccess) setData(res.data);
        else toast.error(res.error[0], 'UserType Master');
      },
      () => {
        toast.error('Something went wrong !!', 'UserType Master');
      }
    ).finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const onEdit = (objRow) => {
    setDbops(DbOperation.update);
    setBtnText('Update');
    setOpen(true);
    setUserType({ id: objRow.id, name: objRow.name });
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  }

  const onOpenModal = () => {
    setOpen(true);
    clearForm();
  };

  const onCloseModal = () => {
    setOpen(false);
    clearForm();
  }

  const onDelete = (Id) => {
    setLoading(true);
    let obj = { id: Id };
    CommonService.delete('UserType', false, obj).then(
      (res) => {
        if (res.isSuccess) {
          getData();
          toast.success('Data Delete Successfully !!','UserType Master');
        } else {
          toast.error(res.errors[0], 'UserType Master');
        }
      },
      () => toast.error('Something Went Wong !!', 'UserType Master')
    ).finally(() => setLoading(false));
  };

  const tableCols = getColumns(['name', 'createdOn'], true, onEdit, onDelete);
  const _validation = submitted ? validatorForm.validate({ userType }, 'userType') : formValidation;

  return (
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Spin spinning={loading}>
              <Tables data={data} columns={tableCols} saveBtnTitle="Add UserType" onAdd={() => setOpen(true)} />
            </Spin>
          </Col>
        </Row>
        <DynamicModal
          visible={open}
          onClose={onCloseModal}
          onSubmit={handleSubmit}
          title={dbops === DbOperation.create ? 'Add UserType' : 'Edit UserType'}
          footerButtons={[
            <Button key="submit" type="primary" onClick={handleSubmit}>
              {btnText}
            </Button>,
            <Button key="close" type="default" onClick={onCloseModal}>
              Close
            </Button>,
          ]}
        >
          <Spin spinning={loading}>
            <Form layout='vertical' onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                validateStatus={_validation?.name?.isInvalid ? 'error' : ''}
                help={_validation?.name?.message}
              >
                <Input name="name" value={userType.name} onChange={handleInputChange} />
              </Form.Item>
            </Form>
          </Spin>
        </DynamicModal>
        <ToastContainer />
      </div>
    </>
  )
}

export default UserType;
