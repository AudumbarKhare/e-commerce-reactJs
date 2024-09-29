import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import DbOperation from '../../_helpers/dbOperation';
import { toast, ToastContainer } from 'react-toastify';
import { CommonService } from '../../_services/Common.Service';
import getColumns from '../common/table/genColumns';
import { Button, Col, Form, Input, Row, Spin, Upload } from 'antd';
import { Tables } from '../common/table/Tables';
import DynamicModal from '../common/DynamicModal';
import noImage from '../../assets/image/noImage.png';
import { UploadOutlined } from '@ant-design/icons';

const Category = () => {
  const [category, setCategory] = useState({
    id: 0,
    name: '',
    title: '',
    isSave: '',
    link: '',
    image: '',
  });

  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState('Save');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(noImage);
  const [formValidation, setFormValidation] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatorForm = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Name is required!',
    },
    {
      field: 'title',
      method: 'isEmpty',
      validWhen: false,
      message: 'Title is required!',
    },
    {
      field: 'isSave',
      method: 'isEmpty',
      validWhen: false,
      message: 'Discount Value is required!',
    },
    {
      field: 'isSave',
      method: 'isNumeric',
      validWhen: true,
      message: 'Discount Value must be a number!',
    },
    {
      field: 'link',
      method: 'isEmpty',
      validWhen: false,
      message: 'Link is required!',
    },
  ]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setCategory({
      id: 0,
      name: '',
      title: '',
      isSave: '',
      link: '',
      image: '',
    });
    setDbops(DbOperation.create);
    setBtnText('Save');
    setSubmitted(false);
    setUploadedImage(noImage);
    setFormValidation(validatorForm.valid());
  };

  const handleSubmit = () => {
    const validation = validatorForm.validate({ category },'category');
    setFormValidation(validation);
    setSubmitted(true);

    if (!category.image && dbops === DbOperation.create) {
      toast.error('Please upload an image!', 'Category');
      return;
    }

    if (validation.isValid) {
      let formData = new FormData();
      formData.append('Id', category?.id);
      formData.append('Name', category?.name);
      formData.append('Title', category?.title);
      formData.append('IsSave', category?.isSave);
      formData.append('Link', category?.link);
      if (category.image) formData.append('Image', category?.image, category?.image?.name);
      setLoading(true);
      switch (dbops) {
        case DbOperation.create:
          CommonService.save('Category', true, formData).then(
            (res) => {
              if (res.isSuccess) {
                toast.success('Data has been saved successfully', 'Category Master');
                clearForm();
                getData();
              } else {
                toast.error(res.errors[0], 'Category Master');
              }
            },
            () => toast.error('Something went wrong!', 'Category Master')
          ).finally(()=>setLoading(false));
          break;
        case DbOperation.update:
          CommonService.update('Category', true, formData).then(
            (res) => {
              if (res.isSuccess) {
                toast.success('Data has been updated successfully!', 'Category Master');
                clearForm();
                getData();
              } else {
                toast.error(res.errors[0], 'Category Master');
              }
            },
            () => toast.error('Something went wrong!', 'Category Master')
          ).finally(()=>setLoading(false));
          break;
      }
    }
  };

  const getData = () => {
    setLoading(true);
    CommonService.getAll('Category', false)
      .then((res) => {
        if (res.isSuccess) setData(res.data);
        else toast.error(res.errors[0], 'Category Master');
      })
      .catch(() => toast.error('Something went wrong!', 'Category Master'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleImgChange = (info) => {
    const file = info.file;

    if (!file) {
      return;
    }

    const type = file.type;
    if (!type.match(/image\/*/)) {
      toast.error('Only images are supported!', 'Category Master');
      return;
    }

    setCategory((prevCategory) => ({
      ...prevCategory,
      image: file,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onEdit = (objRow) => {
    setDbops(DbOperation.update);
    setBtnText('Update');
    setOpen(true);
    setCategory({
      id: objRow.id,
      name: objRow.name,
      title: objRow.title,
      isSave: objRow.isSave,
      link: objRow.link,
      image: '',
    });
    setUploadedImage(objRow.imagePath);
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  };

  const onOpenModal = () => {
    setOpen(true);
    clearForm();
  };

  const onCloseModal = () => {
    setOpen(false);
    clearForm();
  };

  const onDelete = (Id) => {
    setLoading(true);
    let obj = { id: Id };
    CommonService.delete('Category', false, obj).then(
      (res) => {
        if (res.isSuccess) {
          getData();
          toast.success('Data Delete Successfully !!','Category Master');
        } else {
          toast.error(res.errors[0], 'Category Master');
        }
      },
      () => toast.error('Something went wrong!', 'Category Master')
    ).finally(()=>setLoading(false));
  };

  const tableCols = getColumns(['name', 'title', 'isSave', 'link', 'imagePath', 'createdOn'], true, onEdit, onDelete);
  const _validation = submitted ? validatorForm.validate({ category }, 'category') : formValidation;

  return (
    <>
      <div className="container-fluid">
        <Row>
          <Col span={24}>
            <Spin spinning={loading}>
              <Tables 
              data={data} 
              columns={tableCols}
              saveBtnTitle="Add Category" 
              onAdd={onOpenModal} />
            </Spin>
          </Col>
        </Row>
        <DynamicModal
          visible={open}
          onClose={onCloseModal}
          onSubmit={handleSubmit}
          title={dbops === DbOperation.create ? 'Add Category' : 'Edit Category'}
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
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                validateStatus={_validation?.name?.isInvalid ? 'error' : ''}
                help={_validation?.name?.message}
              >
                <Input name="name" value={category.name} onChange={handleInputChange} />
              </Form.Item>
              {/* <Form layout='vertical' onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                // name="name"
                validateStatus={ _validation.name.isInvalid ? 'error' : ''}
                // help={submitted && formValidation.name.message}
              >
                <Input name="name" value={category.name} onChange={handleInputChange} />
              </Form.Item> */}
              <Form.Item
                label="Title"
                validateStatus={_validation?.title?.isInvalid ? 'error' : ''}
                help={_validation?.title?.message}
              >
                <Input name="title" value={category.title} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item
                label="Discount Value"
                validateStatus={_validation?.isSave?.isInvalid ? 'error' : ''}
                help={_validation?.isSave?.message}
              >
                <Input name="isSave" value={category.isSave} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item
                label="Link"
                validateStatus={_validation?.link?.isInvalid ? 'error' : ''}
                help={_validation?.link?.message}
              >
                <Input name="link" value={category.link} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item label="Category Image">
                <Upload
                  beforeUpload={() => false}
                  onChange={handleImgChange}
                  accept="image/*"
                  showUploadList={false}
                  name="image"
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <br />
                {uploadedImage && (
                  <img
                    alt="category"
                    src={uploadedImage}
                    style={{ width: '100px', height: '100px', marginTop: '10px' }}
                  />
                )}
              </Form.Item>
            </Form>
          </Spin>
        </DynamicModal>
      </div>
      <ToastContainer />
    </>
  );
};

export default Category;
