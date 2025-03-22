import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import { Button, Card, Col, Row, Form, Input, Spin } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import { Tables } from '../common/table/Tables';
import getColumns from '../common/table/genColumns';
import DynamicModal from '../common/DynamicModal';
import { CommonService } from '../../_services/Common.Service';
import DbOperation from '../../_helpers/dbOperation';

const Size = () => {
  const validatorForm = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Size Name is Required !!'
    }
  ]);

  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState("Save");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ id: 0, name: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formValidation, setFormValidation] = useState(validatorForm.valid());
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSize((prevSize) => ({
      ...prevSize,
      [name]: value
    }));
  };

  const clearForm = () => {
    setDbops(DbOperation.create);
    setBtnText("Save");
    setSize({ id: 0, name: '' });
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  };

  const handleSubmit = () => {
    const validation = validatorForm.validate({ size }, 'size');
    setFormValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {
      setLoading(true);
      const updatedSize = { ...size };

      switch (dbops) {
        case DbOperation.create:
          CommonService.save("SizeMaster", false, updatedSize)
            .then(
              res => {
                if (res.isSuccess) {
                  toast.success("Data has been saved successfully !!", "Size Master");
                  clearForm();
                  getData();
                } else {
                  toast.error(res.errors[0], "Size Master");
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "Size Master");
              }
            ).finally(() => setLoading(false));
          break;
        case DbOperation.update:
          CommonService.update("SizeMaster", false, updatedSize)
            .then(
              res => {
                if (res.isSuccess) {
                  toast.success("Data has been updated successfully !!", "Size Master");
                  clearForm();
                  getData();
                } else {
                  toast.error(res.errors[0], "Size Master");
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "Size Master");
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
    CommonService.getAll("SizeMaster", false)
      .then(
        res => {
          if (res.isSuccess) {
            setData(res.data);
          } else {
            toast.error(res.errors[0], "Size Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Size Master");
        }
      ).finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const onEdit = (objRow) => {
    setDbops(DbOperation.update);
    setBtnText("Update");
    setOpen(true);
    setSize({ id: objRow.id, name: objRow.name });
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  };

  const onOpenModal = () => {
    clearForm();
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };

  const onDelete = (Id) => {
    let obj = { id: Id };
    setLoading(true);
    CommonService.delete("SizeMaster", false, obj)
      .then(
        res => {
          if (res.isSuccess) {
            getData();
            toast.success('Data Delete Successfully !!','Size Master');
          } else {
            toast.error(res.errors[0], "Size Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Size Master");
        }
      ).finally(() => setLoading(false));
  };

  const columns = ['name', 'createdOn'];
  const tableCols = getColumns(columns, true, onEdit, onDelete);

  let _validation = submitted ? validatorForm.validate({ size }, 'size') : formValidation;

  return (
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Card title='Size Master'>
              <Spin spinning={loading}>
                <Tables
                  data={data}
                  columns={tableCols}
                  onAdd={onOpenModal}
                  saveBtnTitle="Add Size"
                />
              </Spin>
            </Card>
          </Col>
        </Row>

        <DynamicModal
          visible={open}
          onClose={onCloseModal}
          onSubmit={handleSubmit}
          title={dbops === DbOperation.create ? "Add Size" : "Edit Size"}
          footerButtons={[
            <Button key="submit" type='primary' onClick={handleSubmit}>{btnText}</Button>,
            <Button key="close" type='default' onClick={onCloseModal}>Close</Button>
          ]}
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Size Name"
              validateStatus={_validation.name.isInvalid ? 'error' : ''}
              help={_validation.name.isInvalid ? _validation.name.message : ''}
            >
              <Input
                type='text'
                name='name'
                value={size.name}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Form>
        </DynamicModal>
      </div>
      <ToastContainer />
    </>
  );
};

export default Size;

