import React, { useEffect, useState } from 'react';
import withNavigate from '../../../_helpers/WithNavigate';
import withLocation from '../../../_helpers/withLocation';
import { Col, Form, Row, Input, Spin, Select, Radio, Upload, Button, Card, Image } from 'antd';
// import "./product.css";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import FormValidator from '../../../_validators/FormValidator';
import bigImg from '../../../assets/image/bigImage.jpg';
import productImg from '../../../assets/image/noImage.png';
import DbOperation from '../../../_helpers/dbOperation';
import { toast, ToastContainer } from 'react-toastify';
import { CommonService } from '../../../_services/Common.Service';
import Global from '../../../_helpers/BasePath';

const uploadButton = (
    <button style={{
        border: 0,
        background: 'none'
    }}
        type='button'
    >
        <PlusOutlined />
        <div style={{
            marginTop: 8
        }}>
            Upload
        </div>
    </button>
)

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
    const initial_state = {
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
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initial_state);

    const [form] = Form.useForm();

    const handleChangeInput = (e) => {
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

    const getPictures = (id) => {

        CommonService.getProductPicturebyId('ProductMaster', false, id).then(res => {
            if (res.isSuccess && res.data.length > 0) {
                const images = res.data.map((img) =>
                    // console.log(Global.BASE_IMAGES_PATH + img.name)
                    img != null ? Global.BASE_IMAGES_PATH + img.name : productImg
                );
                setState((prevState) => ({
                    ...prevState,
                    bigImage: images[0] || bigImg,
                    productImages: images.map((img) => ({ img })),
                }));
            }
        }, (error) => {
            toast.error("Someting Went Wrong !!", "Add Product")
        })

    }

    const fillData = (productId) => {
        CommonService.getById("ProductMaster", false, productId)
            .then(
                res => {
                    if (res.isSuccess) {
                        const { id, name, code, title, price, salePrice, discount, quantity, colorId, tagId, categoryId, sizeId, isSale, shortDetails, description, isNew } = res.data;
                        setState((prev) => ({
                            ...prev,
                            dbops: DbOperation.update,
                            btnText: "Update",
                            product: {
                                id,
                                name,
                                code,
                                title,
                                price,
                                salePrice,
                                discount,
                                quantity,
                                colorId,
                                tagId,
                                categoryId,
                                sizeId,
                                isSale: isSale === 1 ? true : false,
                                isNew: isNew === 1 ? true : false,
                                shortDetails,
                                description
                            },
                        }));
                        getPictures(id);
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                (error) => {
                    toast.error("Someting Went Wrong !!", "Add Product")
                }
            )
    }
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
        setState(initial_state);
    }

    const handleSubmit = () => {
        // setState((prevState) => ({
        //     ...prevState,
        //     product:form.getFieldsValue()
        // }));
        // const data = form.getFieldsValue();
        const { product, dbops } = state;
        // console.log("Product " + JSON.stringify(product));
        const validation = validatorReg.validate({ product }, 'product');

        console.log("Product validation" + JSON.stringify(validation));
        setState((prevState) => ({
            ...prevState,
            validationReg: validation,
            submitted: true,
        }));
        const { categoryId, code, colorId, description, discount, name, price, quantity, salePrice, shortDetails, sizeId, tagId, title } = product;

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
                                props.navigate('/products/physical/product-list');
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
                                props.navigate('/products/physical/product-list');
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
    let _validation = submitted ? validatorReg.validate({ product }, 'product') : validationReg;
    return (
        <>

            <Spin spinning={loading}>
                <h2>{state.btnText} Product</h2>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Row gutter={[16, 16]} style={{ height: '100vh' }}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Product Name"
                                validateStatus={_validation?.name?.isInvalid ? 'error' : ''}
                                help={_validation?.name?.message}
                            >
                                <Input name="name" value={product.name} placeholder='Enter the Product Name' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Product code"
                                validateStatus={_validation?.code?.isInvalid ? 'error' : ''}
                                help={_validation?.code?.message}
                            >
                                <Input name="code" value={product.code} placeholder='Enter the Product code' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Sale Price"
                                validateStatus={_validation?.salePrice?.isInvalid ? 'error' : ''}
                                help={_validation?.salePrice?.message}
                            >
                                <Input name="salePrice" value={product.salePrice} placeholder='Enter the Product Sale Price' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Quantity"
                                validateStatus={_validation?.quantity?.isInvalid ? 'error' : ''}
                                help={_validation?.quantity?.message}
                            >
                                <Input name="quantity" value={product.quantity} placeholder='Enter the Product Quantity' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Color"
                                validateStatus={_validation?.colorId?.isInvalid ? 'error' : ''}
                                help={_validation?.colorId?.message}
                            >
                                <Select name="colorId" value={product.colorId} placeholder="Select the Product Color" onChange={(value) => handleChangeInput({ target: { name: 'colorId', value } })}>
                                    {state.objColors.map(color => (
                                        <Select.Option key={color.id} value={color.id}>{color.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tag"
                                validateStatus={_validation?.tagId?.isInvalid ? 'error' : ''}
                                help={_validation?.tagId?.message}
                            >
                                <Select name="tagId" value={product.tagId} placeholder="Select the Product Tag" onChange={(value) => handleChangeInput({ target: { name: 'tagId', value } })}>
                                    {state.objTags.map(tag => (
                                        <Select.Option key={tag.id} value={tag.id}>{tag.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Category"
                                validateStatus={_validation?.categoryId?.isInvalid ? 'error' : ''}
                                help={_validation?.categoryId?.message}
                            >
                                <Select name="categoryId" value={product.categoryId} placeholder="Select the Product Category" onChange={(value) => handleChangeInput({ target: { name: 'categoryId', value } })}>
                                    {state.objCategories.map(category => (
                                        <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Short Details"
                                validateStatus={_validation?.shortDetails?.isInvalid ? 'error' : ''}
                                help={_validation?.shortDetails?.message}
                            >
                                <Input.TextArea value={product.shortDetails} name="shortDetails" placeholder='Enter the Product Short Details' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                validateStatus={_validation?.description?.isInvalid ? 'error' : ''}
                                help={_validation?.description?.message}
                            >
                                <Input.TextArea value={product.description} name="description" placeholder='Enter the Product Description' onChange={handleChangeInput} />
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
                                label="Product Title"
                                validateStatus={_validation?.title?.isInvalid ? 'error' : ''}
                                help={_validation?.title?.message}
                            >
                                <Input name="title" value={product.title} placeholder='Enter the Product Title' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Product Price"
                                validateStatus={_validation?.price?.isInvalid ? 'error' : ''}
                                help={_validation?.price?.message}
                            >
                                <Input name="price" value={product.price} placeholder='Enter the Product Price' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Discount"
                                validateStatus={_validation?.discount?.isInvalid ? 'error' : ''}
                                help={_validation?.discount?.message}
                            >
                                <Input name="discount" value={product.discount} placeholder='Enter the discount' onChange={handleChangeInput} />
                            </Form.Item>
                            <Form.Item
                                label="Size"
                                validateStatus={_validation?.sizeId?.isInvalid ? 'error' : ''}
                                help={_validation?.sizeId?.message}
                            >
                                <Select name="sizeId" value={product.sizeId} placeholder="Select the Product Size" onChange={(value) => handleChangeInput({ target: { name: 'sizeId', value } })}>
                                    {state.objSizes.map(size => (
                                        <Select.Option key={size.id} value={size.id}>{size.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row gutter={16} >
                                <Col span={12} style={{ marginLeft: '20px' }}>
                                    <Image
                                        width={400}
                                        height={500}
                                        src={state.bigImage}
                                        alt='Product Image'
                                    />
                                </Col>
                                <Col span={4}>
                                    {
                                        state.btnText.toLowerCase() === 'update' ? (
                                            state.productImages.map((image, index) => (

                                                <Image key={index}
                                                    width={100}
                                                    height={100}
                                                    src={image.img}
                                                />
                                            ))
                                        ) : (state.productImages.map((image, index) => (

                                            <Image key={index}
                                                width={100}
                                                height={100}
                                                src={image.img}
                                            />
                                        )))


                                    }
                                </Col>
                            </Row>
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
            </Spin>
            <ToastContainer />
        </>
    );
};

export default withNavigate(withLocation(AddProduct));
