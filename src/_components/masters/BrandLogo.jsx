import React, { useEffect, useState } from 'react';
import DbOperation from '../../_helpers/dbOperation';
import noImage from '../../assets/image/noImage.png';
import { Button, Col, Form, Input, Row, Spin, Upload } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import FormValidator from '../../_validators/FormValidator';
import { CommonService } from '../../_services/Common.Service';
import getColumns from '../common/table/genColumns';
import { Tables } from '../common/table/Tables';
import DynamicModal from '../common/DynamicModal';
import { UploadOutlined } from '@ant-design/icons';

const BrandLogo = () => {

  const validatorForm = new FormValidator([
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'BrandLogo Name is required'
    },
  ]);

  const [dbops, setDbops] = useState(DbOperation.create);
  const [btnText, setBtnText] = useState("Save");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [brandLogo, setBrandLogo] = useState({ id: 0, name: '', image: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formValidation, setFormValidation] = useState(validatorForm.valid());
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(noImage);

  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandLogo((prevBrandlogo) => ({
      ...prevBrandlogo,
      [name]: value
    }));
  };

  const clearForm = () => {
    setDbops(DbOperation.create);
    setBtnText("Save");
    setBrandLogo({ id: 0, name: '', image: '' });
    setSubmitted(false);
    setUploadedImage(noImage);
    form.resetFields();
  }

  const handleSubmit = () => {
    const validation = validatorForm.validate({ brandLogo }, 'brandLogo');
    setFormValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {

      setLoading(true);
      const formData = new FormData();
      formData.append("Id", brandLogo.id);
      formData.append("Name", brandLogo.name);
      if (brandLogo.image) {
        //console.log(brandLogo+" "+brandLogo.image+" "+brandLogo.image.name)
        formData.append("Image", brandLogo.image, brandLogo.image.name);
      }
      switch (dbops) {
        case DbOperation.create:
          CommonService.save("BrandLogo", true, formData)
            .then(
              (res) => {
                if (res.isSuccess) {
                  toast.success("Data has been saved successfully!!", "BrandLogo Master");
                  clearForm();
                  getData();
                  setOpen(false);
                } else {
                  toast.error(res.errors[0], "BrandLogo Master");
                }
              },
              () => {
                toast.error("Something Went Wrong !!", "BrandLogo Master");
              }
            )
            .finally(() => setLoading(false));
          break;
        case DbOperation.update:
          CommonService.update("BrandLogo", true, formData)
            .then(
              (res) => {
                if (res.isSuccess) {
                  toast.success("Data has been updated successfully!!", "BrandLogo Master");
                  clearForm();
                  getData();
                  setOpen(false);
                } else {
                  toast.error(res.errors[0], "BrandLogo Master");
                }
              },
              () => {
                toast.error("Something went Wrong!!", "BrandLogo Master")
              }
            )
            .finally(() => setLoading(false));
          break;
        default:
          break;
      }
    }
  };

  const getData = () => {
    setLoading(true);
    CommonService.getAll("BrandLogo", false)
      .then(
        (res) => {
          if (res.isSuccess) {
            setData(res.data);
          } else {
            toast.error(res.errors[0], "BrandLogo Master");
          }
        },
        () => {
          toast.error("Something went wrong!!", "BrandLogo Master")
        }
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getData();
  }, []);

  const onEdit = (objRow) => {
    setDbops(DbOperation.update);
    setBtnText("Update");
    setOpen(true);
    setBrandLogo({ id: objRow.id, name: objRow.name, image: '' });
    setUploadedImage(objRow.imagePath);
    setSubmitted(false);
    setFormValidation(validatorForm.valid());
  }

  const onOpenModal = () => {
    setOpen(true);
    clearForm();
  };


  const onDelete = (Id) => {
    const obj = { id: Id };
    setLoading(true);
    CommonService.delete("BrandLogo", false, obj)
      .then(
        (res) => {
          if (res.isSuccess) {
            getData();
            toast.success('Data Delete Successfully !!','BrandLogo Master');
          } else {
            toast.error(res.errors[0], "BrandLogo Master");
          }
        },
        () => {
          toast.error("Something Went Wrong!!", "BrandLogo Master");
        }
      )
      .finally(() => setLoading(false));
  }

  const handleImgChange = (info) => {
    const file = info.file;

    // Ensure the file object is defined
    if (!file) {
      return;
    }

    const type = file.type;

    if (type.match(/image\/*/) == null) {
      toast.error("Only images are supported here!", "BrandLogo Master");
      return;
    }

    setBrandLogo((prevBrandLogo) => ({
      ...prevBrandLogo,
      image: file,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };




  const columns = ['name', 'imagePath', 'createdOn'];
  const tableCols = getColumns(columns, true, onEdit, onDelete);
  const _validation = submitted ? validatorForm.validate({ brandLogo }, 'brandLogo') : formValidation;
  return (
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Spin spinning={loading}>
              {/* {JSON.stringify(data)} */}
              <Tables
                data={data}
                columns={tableCols}
                onAdd={onOpenModal}
                saveBtnTitle='Add BrandLogo'
              />
            </Spin>
          </Col>
        </Row>
        {/* {console.log(data)} */}

        <DynamicModal
          visible={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          title={dbops === DbOperation.create ? "Add Color" : "Edit Color"}
          footerButtons={[
            <Button key="submit" type='primary' onClick={handleSubmit}>{btnText}</Button>,
            <Button key='close' type='default' onClick={() => setOpen(false)}>Close</Button>
          ]}
        >
          <Spin spinning={loading}>
            <Form layout='vertical' onFinish={handleSubmit}>
              <Form.Item
                label="BrandLogo Name"
                validateStatus={_validation.name.isInvalid ? _validation.name.message : ''}
              >
                <Input
                  type='text'
                  value={brandLogo.name}
                  name='name'
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="BrandLogo Logo">
                <Upload
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={handleImgChange}
                  accept='image/*'
                  showUploadList={false}
                  name='image'
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <br />
                {uploadedImage && (
                  <img
                    alt="brand logo"
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
  )
}

export default BrandLogo;
