import React, { useState, useEffect } from 'react';
import FormValidator from '../../../_validators/FormValidator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CommonService } from '../../../_services/Common.Service';
import DbOperation from '../../../_helpers/dbOperation';
import withNavigate from '../../../_helpers/WithNavigate';
import withLocation from '../../../_helpers/WithLocation';
import productImg from '../../../assets/image/noImage.png';
import bigImg from '../../../assets/image/bigImage.jpg';
import Global from '../../../_helpers/BasePath';
import { Form, Input, Select, Button, Row, Col, Card, Image, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import CKEditor from 'react-ckeditor-component';

const AddProduct = (props) => {
  const validatorReg = new FormValidator([
    { field: 'name', method: 'isEmpty', validWhen: false, message: 'Name is required' },
    { field: 'title', method: 'isEmpty', validWhen: false, message: 'Title is required' },
    { field: 'code', method: 'isEmpty', validWhen: false, message: 'Code is required' },
    { field: 'price', method: 'isEmpty', validWhen: false, message: 'Price is required' },
    { field: 'salePrice', method: 'isEmpty', validWhen: false, message: 'Sale Price is required' },
    { field: 'discount', method: 'isEmpty', validWhen: false, message: 'Discount is required' },
    { field: 'sizeId', method: 'isEmpty', validWhen: false, message: 'Size is required' },
    { field: 'colorId', method: 'isEmpty', validWhen: false, message: 'Color is required' },
    { field: 'tagId', method: 'isEmpty', validWhen: false, message: 'Tag is required' },
    { field: 'categoryId', method: 'isEmpty', validWhen: false, message: 'Category is required' }
  ]);

  const [form] = Form.useForm();

  const [state, setState] = useState({
    bigImage: bigImg,
    productImages: new Array(5).fill({ img: productImg }),
    dbops: DbOperation.create,
    btnText: 'Save',
    product: {
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      quantity: 1,
      colorId: '',
      tagId: '',
      categoryId: '',
      sizeId: '',
      isNew: false,
      isSale: false,
      shortDetails: '',
      description: '',
    },
    objSizes: [],
    objColors: [],
    objTags: [],
    objCategories: [],
    submitted: false,
    validationReg: validatorReg.valid(),
  });

  const [fileToUpload, setFileToUpload] = useState([]);

  useEffect(() => {
    getCategories();
    getColors();
    getSizes();
    getTags();

    if (props.location.state && props.location.state.productId) {
      fillData(props.location.state.productId);
    }
  }, []);

  const fillData = async (productId) => {
    try {
      const response = await CommonService.getById('ProductMaster', false, productId);
      if (response.isSuccess) {
        const res = response.data;
        setState((prevState) => ({
          ...prevState,
          dbops: DbOperation.update,
          btnText: 'Update',
          product: {
            ...prevState.product,
            ...res,
          },
        }));
        getPictures(res.id);
      } else {
        toast.error(response.errors[0], 'Add Product');
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const getPictures = async (id) => {
    try {
      const res = await CommonService.getProductPicturebyId('ProductMaster', false, id);
      if (res.isSuccess && res.data.length > 0) {
        const images = res.data.map(img => (img != null ? Global.BASE_IMAGES_PATH + img.name : productImg));
        setState((prevState) => ({
          ...prevState,
          bigImage: images[0] || bigImg,
          productImages: images.map(img => ({ img })),
        }));
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const getColors = async () => {
    try {
      const res = await CommonService.getAll('ColorMaster', false);
      if (res.isSuccess) {
        setState((prevState) => ({ ...prevState, objColors: res.data }));
      } else {
        toast.error(res.errors[0], 'Add Product');
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const getTags = async () => {
    try {
      const res = await CommonService.getAll('TagMaster', false);
      if (res.isSuccess) {
        setState((prevState) => ({ ...prevState, objTags: res.data }));
      } else {
        toast.error(res.errors[0], 'Add Product');
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const getSizes = async () => {
    try {
      const res = await CommonService.getAll('SizeMaster', false);
      if (res.isSuccess) {
        setState((prevState) => ({ ...prevState, objSizes: res.data }));
      } else {
        toast.error(res.errors[0], 'Add Product');
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const getCategories = async () => {
    try {
      const res = await CommonService.getAll('Category', false);
      if (res.isSuccess) {
        setState((prevState) => ({ ...prevState, objCategories: res.data }));
      } else {
        toast.error(res.errors[0], 'Add Product');
      }
    } catch {
      toast.error('Something Went Wrong !!', 'Add Product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      product: {
        ...prevState.product,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleEditorChange = (e) => {
    const content = e.editor.getData();
    setState((prevState) => ({
      ...prevState,
      product: {
        ...prevState.product,
        description: content,
      },
    }));
  };

  const clearForm = () => {
    setState((prevState) => ({
      ...prevState,
      bigImage: bigImg,
      productImages: new Array(5).fill({ img: productImg }),
      dbops: DbOperation.create,
      btnText: 'Save',
      product: {
        id: 0,
        name: '',
        title: '',
        code: '',
        price: '',
        salePrice: '',
        discount: '',
        quantity: 1,
        colorId: '',
        tagId: '',
        categoryId: '',
        sizeId: '',
        isNew: false,
        isSale: false,
        shortDetails: '',
        description: '',
      },
      submitted: false,
      validationReg: validatorReg.valid(),
    }));
    setFileToUpload([]);
  };

  const handleCancel = () => {
    props.navigate('/products/physical/productList');
  };

  const handleImgChange = (info) => {
    const { fileList } = info;
    // console.log(JSON.stringify(fileList));
    const updatedImages = fileList.map(file => {

      if (file) {
        // console.log(JSON.stringify(file));
        const imgUrl = URL.createObjectURL(file.originFileObj);
        return { img: imgUrl };
      }
      return { img: productImg };
    });

    setState((prevState) => ({
      ...prevState,
      productImages: updatedImages,
      bigImage: updatedImages[0]?.img || bigImg,
    }));

    // Update fileToUpload array with the selected files
    setFileToUpload(fileList.map(file => file.originFileObj));
  };

  const handleSubmit = async (e) => {
    console.log(JSON.stringify(state));
    let formData = new FormData();
    const validation = validatorReg.validate(state, 'product');
    setState((prevState) => ({
      ...prevState,
      validationReg: validation,
      submitted: true,
    }));


    if (validation.isValid) {
      const { product } = state;
      formData.append("Id", product.id);
      formData.append("Name", product.name);
      formData.append("Title", product.title);
      formData.append("Code", product.code);
      formData.append("Price", product.price);
      formData.append("SalePrice", product.salePrice);
      formData.append("Discount", product.discount);
      formData.append("Quantity", product.quantity);
      formData.append("TagId", product.tagId);
      formData.append("ColorId", product.colorId);
      formData.append("CategoryId", product.categoryId);
      formData.append("SizeId", product.sizeId);
      formData.append("IsSale", product.isSale);
      formData.append("IsNew", product.isNew);
      formData.append("ShortDetails", product.shortDetails);
      formData.append("Description", product.description);


      console.log(fileToUpload)
      if (fileToUpload) {
        for (let i = 0; i < fileToUpload.length; i++) {
          //formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
          let ToUpload = fileToUpload[i];
          formData.append("Image", ToUpload, ToUpload.name);
        }
      }
      console.log(formData.entries);
      // Object.entries(state.product).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      // console.log(formData);

      // fileToUpload.forEach(file => {
      //   formData.append("Image", file);
      // });
      // console.log(JSON.stringify(formData))
      try {
        let res;
        if (state.dbops === DbOperation.create) {

          res = await CommonService.save('ProductMaster', false, formData);
        } else {
          res = await CommonService.update('ProductMaster', false, state.product.id, formData);
        }
        console.log(res);
        if (res.isSuccess) {
          toast.success(`Product ${state.dbops === DbOperation.create ? 'added' : 'updated'} successfully!`, 'Add Product');
          clearForm();
        } else {
          toast.error(res.errors[0], 'Add Product');
        }
      } catch {
        toast.error('Something Went Wrong !!', 'Add Product');
      }
    }
  };

  return (
    <div className="add-product">
      <ToastContainer />
      <h2>{state.btnText} Product</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Form.Item label="Product Name">
                <Input
                  name="name"
                  value={state.product.name}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.name && (
                  <span className="error">{state.validationReg.name}</span>
                )}
              </Form.Item>
              <Form.Item label="Product Title">
                <Input
                  name="title"
                  value={state.product.title}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.title && (
                  <span className="error">{state.validationReg.title}</span>
                )}
              </Form.Item>
              <Form.Item label="Product Code">
                <Input
                  name="code"
                  value={state.product.code}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.code && (
                  <span className="error">{state.validationReg.code}</span>
                )}
              </Form.Item>
              <Form.Item label="Price">
                <Input
                  type="number"
                  name="price"
                  value={state.product.price}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.price && (
                  <span className="error">{state.validationReg.price}</span>
                )}
              </Form.Item>
              <Form.Item label="Sale Price">
                <Input
                  type="number"
                  name="salePrice"
                  value={state.product.salePrice}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.salePrice && (
                  <span className="error">{state.validationReg.salePrice}</span>
                )}
              </Form.Item>
              <Form.Item label="Discount">
                <Input
                  type="number"
                  name="discount"
                  value={state.product.discount}
                  onChange={handleInputChange}
                />
                {state.submitted && !state.validationReg.discount && (
                  <span className="error">{state.validationReg.discount}</span>
                )}
              </Form.Item>
              <Form.Item label="Quantity">
                <Input
                  type="number"
                  name="quantity"
                  value={state.product.quantity}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Size">
                <Select
                  name="sizeId"
                  value={state.product.sizeId}
                  onChange={(value) => handleInputChange({ target: { name: 'sizeId', value } })}
                >
                  {state.objSizes.map(size => (
                    <Select.Option key={size.id} value={size.id}>{size.name}</Select.Option>
                  ))}
                </Select>
                {state.submitted && !state.validationReg.sizeId && (
                  <span className="error">{state.validationReg.sizeId}</span>
                )}
              </Form.Item>
              <Form.Item label="Color">
                <Select
                  name="colorId"
                  value={state.product.colorId}
                  onChange={(value) => handleInputChange({ target: { name: 'colorId', value } })}
                >
                  {state.objColors.map(color => (
                    <Select.Option key={color.id} value={color.id}>{color.name}</Select.Option>
                  ))}
                </Select>
                {state.submitted && !state.validationReg.colorId && (
                  <span className="error">{state.validationReg.colorId}</span>
                )}
              </Form.Item>
              <Form.Item label="Tag">
                <Select
                  name="tagId"
                  value={state.product.tagId}
                  onChange={(value) => handleInputChange({ target: { name: 'tagId', value } })}
                >
                  {state.objTags.map(tag => (
                    <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>
                  ))}
                </Select>
                {state.submitted && !state.validationReg.tagId && (
                  <span className="error">{state.validationReg.tagId}</span>
                )}
              </Form.Item>
              <Form.Item label="Category">
                <Select
                  name="categoryId"
                  value={state.product.categoryId}
                  onChange={(value) => handleInputChange({ target: { name: 'categoryId', value } })}
                >
                  {state.objCategories.map(category => (
                    <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                  ))}
                </Select>
                {state.submitted && !state.validationReg.categoryId && (
                  <span className="error">{state.validationReg.categoryId}</span>
                )}
              </Form.Item>
              <Form.Item label="Short Details">
                <Input.TextArea
                  name="shortDetails"
                  value={state.product.shortDetails}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  name="description"
                  value={state.product.description}
                  onChange={handleInputChange}
                />
                {/* <CKEditor
                  name="description"
                  content={state.product.description}
                  events={{
                    change: handleEditorChange,
                  }}
                /> */}
              </Form.Item>
              <Form.Item label="Upload Images">
                <Upload
                  beforeUpload={() => false}
                  onChange={handleImgChange}
                  multiple
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {state.btnText}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={clearForm}>
                  Clear
                </Button>
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Image
                width={200}
                height={200}
                src={state.bigImage}
                alt="Product Image"
              />
              <Row gutter={16}>
                {state.productImages.map((image, index) => (
                  <Col key={index} span={6}>
                    <Image
                      width={80}
                      height={80}
                      src={image.img}
                      alt={`Product Sub Image ${index + 1}`}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default withNavigate(withLocation(AddProduct));
