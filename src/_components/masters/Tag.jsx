import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import DbOperation from '../../_helpers/dbOperation';
import { CommonService } from '../../_services/Common.Service';
import { toast } from 'react-toastify';
import getColumns from '../common/table/genColumns';
import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { Tables } from '../common/table/Tables';
import DynamicModal from '../common/DynamicModal';

const Tag = () => {
  const validatorForm = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Tag Name is Required !!'
    }
  ]);

  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState("Save");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState({ id: 0, name: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formValidation, setFormValidation] = useState(validatorForm.valid());
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTag((prevTag) => ({
      ...prevTag,
      [name]: value
    }));
  };

  const clearForm = () => {
    setDbops(DbOperation.create);
    setBtnText("Save");
    setTag({ id: 0, name: '' });
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  }

  const handleSubmit = () => {
    const validation = validatorForm.validate({ tag }, 'tag');
    setFormValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {
      setLoading(true);
      const updateTag = { ...tag };

      switch (dbops) {
        case DbOperation.create:
          CommonService.save("TagMaster", false, updateTag)
            .then(
              res => {
                if (res.isSuccess) {
                  toast.success("Data has been saved successfully !!");
                  clearForm();
                  getData();
                } else {
                  toast.error(res.errors[0], "Tag Master")
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "Tag Master");
              }
            ).finally(() => {
              setLoading(false);
              setOpen(false);
            });
          break;
        case DbOperation.update:
          CommonService.update("TagMaster", false, updateTag)
            .then(
              res => {
                if (res.isSuccess) {
                  toast.success("Data has been updated successfully !!");
                  clearForm();
                  getData();
                } else {
                  toast.error(res.errors[0], "Tag Master")
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "Tag Master");
              }
            ).finally(() => {
              setLoading(false);
              setOpen(false);
            });
          break;
        default:
          break;
      }
    }
  };

  const getData = () => {
    setLoading(true);
    CommonService.getAll("TagMaster", false)
      .then(
        res => {
          if (res.isSuccess) {
            setData(res.data);
          } else {
            toast.error(res.errors[0], "Tag Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Tag Master");
        }
      ).finally(() => setLoading(false))
  };

  useEffect(() => {
    getData();
  }, []);

  const onEdit = (objRow) => {
    setDbops(DbOperation.update);
    setBtnText("Update");
    setOpen(true);
    setTag({ id: objRow.id, name: objRow.name });
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
    setLoading(true);
    CommonService.delete("TagMaster", false, obj)
      .then(
        res => {
          if (res.isSuccess) {
            getData();
          } else {
            toast.error(res.errors[0], "Tag Master");
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Tag Master");
        }
      ).finally(() => setLoading(false));
  };

  const columns = ['name', 'createdOn'];
  const tableCols = getColumns(columns, true, onEdit, onDelete);

  let _validation = submitted ? validatorForm.validate({ tag }, 'tag') : formValidation;

  return (
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Card title='Tag Master'>
              <Spin spinning={loading}>
                <Tables
                  data={data}
                  columns={tableCols}
                  onAdd={onOpenModal}
                />
              </Spin>
            </Card>
          </Col>
        </Row>

        <DynamicModal
          visible={open}
          onClose={onCloseModal}
          onSubmit={handleSubmit}
          title={dbops === DbOperation.create ? "Add Tag" : "Edit Tag"}
          footerButtons={[
            <Button key="submit" type='primary' onClick={handleSubmit}>{btnText}</Button>,
            <Button key="close" type='default' onClick={onCloseModal}>Close</Button>
          ]}
        >
          <Form layout='vertical' onFinish={handleSubmit}>
            <Form.Item
            label='Tag Name'
            validateStatus={_validation.name.isInvalid?'error':''}
            help={_validation.name.isInvalid?_validation.name.message:""}
            >
              <Input 
              type='text'
              name='name'
              value={tag.name}
              onChange={handleInputChange}
              />
            </Form.Item>
          </Form>
        </DynamicModal>
      </div>
    </>
  )
}
export default Tag;
