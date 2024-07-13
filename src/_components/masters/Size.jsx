import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import ComponentLayout from '../ComponentLayout';
import DbOperation from '../../_helpers/dbOperation';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import Breadcrumbs from '../common/Breadcrumb';
import { Tables } from '../common/table/Tables';
import getColumns from '../common/table/genColumns';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validatorForm.validate({ size }, 'size');
    setFormValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {
      switch (dbops) {
        case DbOperation.create:
          debugger;
          CommonService.save("SizeMaster", false, size)
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
            );
          break;
        case DbOperation.update:
          CommonService.update("SizeMaster", false, size)
            .then(
              res => {
                if (res.isSuccess) {
                  toast.success("Data has been update successfully !!", "Size Master");
                  clearForm();
                  getData();
                } else {
                  toast.error(res.error[0], "Size Master");
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "Size Master");
              }
            );
          break;
        default:
          break;
      }
    }
  };

  const getData = () => {
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
          toast.error("Something Went Wrong !!", "Size Master")
        }
      )
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
  }

  const onCloseModal = () => {
    setOpen(false);
  }

  const onDelete = (Id) => {
    let obj = { id: Id };
    CommonService.delete("SizeMaster", false, obj)
      .then(
        res => {
          if (res.isSuccess) {
            getData();
          } else {
            toast.error(res.errors[0], "Size Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Size Master");
        }
      );
  };

  const columns = ['name', 'createdOn'];
  const tableCols = getColumns(columns, true, onEdit, onDelete)

  let _validation = submitted ? validatorForm.validate({ size }, 'size') : formValidation;

  return (
    // <ComponentLayout />
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Card title='Products Size'>
              <Button type='primary' onClick={onOpenModal}> Add Size </Button>
              <Modal
                title="Add Size"
                visible={open}
                onCancel={onCloseModal}
                footer={null}
              >
                <Form onSubmitCapture={handleSubmit}>
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
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>{btnText}</Button>
                    <Button type='default' onClick={onCloseModal}>Close</Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Tables data={data} columnFilter columns={tableCols}  />
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </>
  )
}

export default Size;
