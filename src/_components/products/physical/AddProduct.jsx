import React, { useEffect, useState } from 'react';
import withNavigate from '../../../_helpers/WithNavigate';
import withLocation from '../../../_helpers/WithLocation';
import { Col, Form, Row, Input, Spin, Select, Radio, Upload, Button, Card, Image } from 'antd';
import "./product.css";
import { UploadOutlined } from '@ant-design/icons';
import FormValidator from '../../../_validators/FormValidator';
import bigImg from '../../../assets/image/bigImage.jpg';
import productImg from '../../../assets/image/noImage.png';
import DbOperation from '../../../_helpers/dbOperation';
import { toast, ToastContainer } from 'react-toastify';
import { CommonService } from '../../../_services/Common.Service';
import Global from '../../../_helpers/BasePath';

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
    const initialState = {
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
    };
    const [fileToUpload, setFileToUpload] = useState([]);
    const [iaLoading, setLoading] = useState(false);
    const [state, setState] = useState(initialState);

    const [form] = Form.useForm();

    const handleChangeInput = (e) => {
        console.log(e.target);
        const { name, value, checked } = e.target;
        setState((prevState) => ({
            ...prevState,
            product: {
                ...prevState.product,
                [name]: value,
            },
        }));
    };



    const handleImgChange = (info) => {
        const { fileList } = info;

        const updatedImages = fileList.map((file) => {
            if (file) {
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

        setFileToUpload(fileList.map((file) => file.originFileObj));
    };

    const getPictures = async (id) => {
        try {
            const res = await CommonService.getProductPicturebyId('ProductMaster', false, id);
            if (res.isSuccess && res.data.length > 0) {
                const images = res.data.map((img) =>
                    img != null ? Global.BASE_IMAGES_PATH + img.name : productImg
                );
                setState((prevState) => ({
                    ...prevState,
                    bigImage: images[0] || bigImg,
                    productImages: images.map((img) => ({ img })),
                }));
            }
        } catch {
            toast.error('Something Went Wrong !!', 'Add Product');
        }
    };

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

    const getAllData = async () => {
        try {
            setLoading(true);
            const [colors, tags, sizes, categories] = await Promise.all([
                CommonService.getAll('ColorMaster', false),
                CommonService.getAll('TagMaster', false),
                CommonService.getAll('SizeMaster', false),
                CommonService.getAll('Category', false),
            ]);

            if (colors.isSuccess && tags.isSuccess && sizes.isSuccess && categories.isSuccess) {
                setState((prevState) => ({
                    ...prevState,
                    objColors: colors.data,
                    objTags: tags.data,
                    objSizes: sizes.data,
                    objCategories: categories.data,
                }));
            } else {
                if (!colors.isSuccess) toast.error(colors.errors[0], 'Add Product');
                if (!tags.isSuccess) toast.error(tags.errors[0], 'Add Product');
                if (!sizes.isSuccess) toast.error(sizes.errors[0], 'Add Product');
                if (!categories.isSuccess) toast.error(categories.errors[0], 'Add Product');
            }
        } catch {
            toast.error('Something Went Wrong !!', 'Add Product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllData();

        if (props.location.state && props.location.state.productId) {
            fillData(props.location.state.productId);
        }
    }, []);

    const clearForm = () => {
        setState(initialState);
    }

    const handleSubmit = () => {
        // setState((prevState) => ({
        //     ...prevState,
        //     product:form.getFieldsValue()
        // }));
        // const data = form.getFieldsValue();
        const { product, dbops } = state;
        console.log("Product " + JSON.stringify(product));
        const validation = validatorReg.validate({ product }, 'product');

        console.log("Product validation" + JSON.stringify(validation));
        setState((prevState) => ({
            ...prevState,
            validationReg: validation,
            submitted: true,
        }));
        const { categoryId, code, colorId, description, discount, name, price, quantity, salePrice, shortDetails, sizeId, tagId, title } = form.getFieldsValue();

        const { isSale, isNew, id } = product;
        // console.log(isSale+" "+isNew+" "+categoryId+" "+code+" "+colorId+" "+description+" "+discount+" "+name+" "+price+" "+quantity+" "+salePrice+" "+shortDetails+" "+sizeId+" "+tagId+" "+title)
        if (dbops === DbOperation.create && fileToUpload.length < 5) {
            toast.error("Please upload 5 images per product !!", "Add Product");
        } else if ((dbops === DbOperation.update && fileToUpload.length > 0) && fileToUpload.length < 5) {
            toast.error("Please upload 5 images per product !!", "Add Product");
        }

        if (validation.isValid) {
            let formData = new FormData();
            formData.append("Id", id);
            formData.append("Name", name);
            formData.append("Title", title);
            formData.append("Code", code);
            formData.append("Price", price);
            formData.append("SalePrice", salePrice);
            formData.append("Discount", discount);
            formData.append("Quantity", quantity);
            formData.append("TagId", tagId);
            formData.append("ColorId", colorId);
            formData.append("CategoryId", categoryId);
            formData.append("SizeId", sizeId);
            formData.append("IsSale", isSale ? 1 : 0);
            formData.append("IsNew", isNew ? 1 : 0);
            formData.append("ShortDetails", shortDetails);
            formData.append("Description", description);

            if (fileToUpload) {
                for (let i = 0; i < fileToUpload.length - 1; i++) {
                    //formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
                    let ToUpload = fileToUpload[i];
                    formData.append("Image", ToUpload, ToUpload.name);
                }
            }
            setLoading(true)
            switch (dbops) {
                case DbOperation.create:
                    CommonService.save('ProductMaster', true, formData).then(
                        (res) => {
                            if (res.isSuccess) {
                                toast.success("Product data has been added successfully !!", "Add Product");
                                clearForm();
                                props.navigate('/products/physical/productList');
                            } else {
                                toast.error(res.errors[0], "Add Product");
                            }
                        },
                        (error) => {
                            toast.error("Some went Wrong !!", "Add Product");
                        }
                    ).finally(() => setLoading(false));
                    break;
                case DbOperation.update:
                    CommonService.update("ProductMaster", true, formData).then(
                        (res) => {
                            if (res.isSuccess) {
                                toast.success("Product data has been added successfully !!", "Add Product");
                                clearForm();
                                props.navigate('/products/physical/productList');
                            } else {
                                toast.error("Some went Wrong !!", "Add Product");
                            }
                        },
                        (error) => {
                            toast.error("Some went Wrong !!", "Add Product");
                        }
                    ).finally(() => setLoading(false));
                    break;
            }

        }
    };
    // const {submitted,product} = state;
    // let _validation = submitted ? validatorReg.validate({ product }, 'product') : state.validationReg;
    const { objCategories, objColors, objSizes, objTags, btnText, submitted, product, validationReg, productImages, bigImage } = state;
    let _validator = submitted ? validatorReg.validate({ product }, 'product') : validationReg;
    return (
        <>
            {iaLoading ? (
                <Spin />
            ) : (
                <>
                    <ToastContainer />
                    <h2>{state.btnText} Product</h2>
                    <Form layout="vertical" form={form} onFinish={handleSubmit}>
                        <Row gutter={[16, 16]} style={{ height: '100vh' }}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Product Name"
                                >
                                    <Input name="name" placeholder='Enter the Product Name' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    label="Product code"
                                >
                                    <Input name="code" placeholder='Enter the Product code' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="salePrice"
                                    label="Sale Price"
                                >
                                    <Input name="salePrice" placeholder='Enter the Product Sale Price' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="quantity"
                                    label="Quantity"
                                >
                                    <Input name="quantity" placeholder='Enter the Product Quantity' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="colorId"
                                    label="Color"
                                >
                                    <Select name="colorId" placeholder="Select the Product Color" onChange={(value) => handleChangeInput({ target: { name: 'colorId', value } })}>
                                        {state.objColors.map(color => (
                                            <Select.Option key={color.id} value={color.id}>{color.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="categoryId"
                                    label="Category"
                                >
                                    <Select name="categoryId" placeholder="Select the Product Category" onChange={(value) => handleChangeInput({ target: { name: 'categoryId', value } })}>
                                        {state.objCategories.map(category => (
                                            <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Short Details"
                                    name="shortDetails"
                                >
                                    <Input.TextArea name="shortDetails" placeholder='Enter the Product Short Details' onChange={handleChangeInput} />
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
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="title"
                                    label="Product Title"
                                >
                                    <Input name="title" placeholder='Enter the Product Title' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="price"
                                    label="Product Price"
                                >
                                    <Input name="price" placeholder='Enter the Product Price' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="discount"
                                    label="Discount"
                                >
                                    <Input name="discount" placeholder='Enter the discount' onChange={handleChangeInput} />
                                </Form.Item>
                                <Form.Item
                                    name="sizeId"
                                    label="Size"
                                >
                                    <Select name="sizeId" placeholder="Select the Product Size" onChange={(value) => handleChangeInput({ target: { name: 'sizeId', value } })}>
                                        {state.objSizes.map(size => (
                                            <Select.Option key={size.id} value={size.id}>{size.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="tagId"
                                    label="Tag"
                                >
                                    <Select name="tagId" placeholder="Select the Product Tag" onChange={(value) => handleChangeInput({ target: { name: 'tagId', value } })}>
                                        {state.objTags.map(tag => (
                                            <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Row>
                                    {/* Moved radio buttons to the top */}
                                    <Col span={12}>
                                        <Form.Item label=" ">
                                            <Radio.Group value={state.product.isNew} name="isNew" onChange={handleChangeInput}>
                                                <Radio name="isNew" value={true}>Is New</Radio>
                                                <Radio name="isNew" value={false}>Not New</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label=" ">
                                            <Radio.Group value={state.product.isSale} name="isSale" onChange={handleChangeInput}>
                                                <Radio name="isSale" value={true}>Is Sale</Radio>
                                                <Radio name="isSale" value={false}>Not Sale</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                >
                                    <Input.TextArea name="description" placeholder='Enter the Product Description' onChange={handleChangeInput} />
                                </Form.Item>
                                {/* <Card> */}
                                <Image
                                    width={200}
                                    height={200}
                                    src={state.bigImage}
                                    alt="Product Image"
                                />
                                <Row gutter={16}>
                                    {state.productImages.map((image, index) => (
                                        <Col key={index} span={3}>
                                            <Image
                                                width={80}
                                                height={80}
                                                src={image.img}
                                                alt={`Product Sub Image ${index + 1}`}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                                {/* </Card> */}
                            </Col>
                        </Row>
                        <Row justify="center" style={{ marginTop: '20px' }}>
                            <Col xs={24} sm={12} md={8} lg={6} style={{ textAlign: 'center' }}>
                                <Button htmlType="submit" type="primary" style={{ margin: '5px' }}> {state.btnText} </Button>
                                <Button style={{ margin: '5px' }}> Cancel </Button>
                                <Button style={{ margin: '5px' }}> Clear </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </>
    );
};

export default withNavigate(withLocation(AddProduct));
