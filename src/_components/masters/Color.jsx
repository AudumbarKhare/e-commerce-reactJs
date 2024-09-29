import React, { useEffect, useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import DbOperation from '../../_helpers/dbOperation';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import getColumns from '../common/table/genColumns';
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import { Tables } from '../common/table/Tables';
import DynamicModal from '../common/DynamicModal';

const Color = () => {
    const validatorForm = new FormValidator([
        {
            field: 'name',
            method: 'isEmpty',
            validWhen: false,
            message: 'Color Name is Required !!'
        },
        {
            field: 'code',
            method: 'isEmpty',
            validWhen: false,
            message: 'Color Code is Required !!'
        },
    ]);

    const [dbops, setDbops] = useState(DbOperation.create);
    const [btnText, setBtnText] = useState("Save");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState({ id: 0, name: '', code: '' });
    const [submitted, setSubmitted] = useState(false);
    const [formValidation, setFormValidation] = useState(validatorForm.valid());
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setColor((prevColor) => ({
            ...prevColor,
            [name]: value
        }))
    };

    const clearForm = () => {
        setDbops(DbOperation.create);
        setBtnText("Save");
        setColor({ id: 0, name: '', code: '' });
        setSubmitted(false);
        setFormValidation(validatorForm.valid());
    }

    const handleSubmit = () => {
        const validation = validatorForm.validate({ color }, 'color');
        setFormValidation(validation);
        setSubmitted(true);

        if (validation.isValid) {
            setLoading(true);
            const updatedColor = { ...color };

            switch (dbops) {
                case DbOperation.create:
                    CommonService.save("ColorMaster", false, updatedColor)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data has been saved successfully!!", "Color Master");
                                    clearForm()
                                    getData();
                                } else {
                                    toast.error(res.errors[0], "Color Master");
                                }
                            },
                            () => {
                                toast.error("Something Went Wrong !!", "Color Master");
                            }
                        ).finally(() => setLoading(false))
                    break;
                case DbOperation.update:
                    CommonService.update("Color Master")
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data has been updated successfully !!", "Color Master");
                                    clearForm();
                                    getData();
                                } else {
                                    toast.error(res.error[0], "Color Master");
                                }
                            },
                            () => {
                                toast.error("Something Went Wrong !!", "Color Master");
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
        CommonService.getAll("ColorMaster", false)
            .then(
                res => {
                    if (res.isSuccess) {
                        setData(res.data);
                    } else {
                        toast.error(res.errors[0], "Color Master");
                    }
                },
                () => {
                    toast.error("Something Went Wrong !!", "Color Master")
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
        setColor({ id: objRow.id, name: objRow.name, code: objRow.code })
        setSubmitted(false);
        setFormValidation(validatorForm.valid());
    }

    const onOpenModal = () => {
        clearForm();
        setOpen(true);
    };

    const onCloseModal = () => {
        setOpen(false);
    }

    const onDelete = (Id) => {
        let obj = { id: Id };
        setLoading(true);
        CommonService.delete("ColorMaster", false, obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        getData();
                        toast.success('Data Delete Successfully !!','Color Master');
                    } else {
                        toast.error(res.errors[0], "Color Master");
                    }
                },
                () => {
                    toast.error("Something Went Wrong !!", "Color Master");
                }
            ).finally(() => setLoading(false));
    }

    const columns = ['name', 'code', 'createdOn'];
    const tabeCols = getColumns(columns, true, onEdit, onDelete);
    let _validation = submitted ? validatorForm.validate({ color }, 'color') : formValidation;

    return (
        <>
            <div className='container-fluid'>
                <Row>
                    <Col span={24}>
                        <Spin spinning={loading}>
                            <Tables
                                data={data}
                                columns={tabeCols}
                                onAdd={onOpenModal}
                                saveBtnTitle="Add Color"
                            />
                        </Spin>
                    </Col>
                </Row>

                <DynamicModal
                    visible={open}
                    onClose={onCloseModal}
                    onSubmit={handleSubmit}
                    title={dbops === DbOperation.create ? "Add Color" : "Edit Color"}
                    footerButtons={[
                        <Button key="submit" type='primary' onClick={handleSubmit}>{btnText}</Button>,
                        <Button key='close' type='default' onClick={onCloseModal}>Close</Button>
                    ]}
                >
                    <Spin spinning={loading}>
                        <Form layout="vertical" onFinish={handleSubmit}>

                            <Form.Item
                                label="Color Name"
                                validateStatus={_validation.name.isInvalid ? 'error' : ''}
                                help={_validation.name.isInvalid ? _validation.name.message : ''}
                            >
                                <Input
                                    type='text'
                                    value={color.name}
                                    name='name'
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Color code"
                                validateStatus={_validation.code.isInvalid ? 'error' : ''}
                                help={_validation.code.isInvalid ? _validation.code.message : ''}
                            >
                                <Input
                                    type='text'
                                    value={color.code}
                                    name='code'
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                        </Form>
                    </Spin>
                </DynamicModal>
            </div>
            <ToastContainer />
        </>
    )
}

export default Color;