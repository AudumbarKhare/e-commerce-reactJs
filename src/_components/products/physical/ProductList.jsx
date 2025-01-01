import React, { useEffect, useState } from 'react';
import { CommonService } from '../../../_services/Common.Service';
import { toast } from 'react-toastify';
import getColumns from '../../common/table/genColumns';
import { Col, Row, Spin } from 'antd';
import { Tables } from '../../common/table/Tables';
import withNavigate from '../../../_helpers/WithNavigate';

const ProductList = (props) => {
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(false);

  const handleAddUser = () => {
    props.navigate('/products/physical/addProduct');
  };

  const onEdit = (row) => {
    props.navigate(`/products/physical/addProduct`, { state: { objRow: row } });
  }

  const onDelete = (Id) => {
    const obj = { id: Id };
    setLoading(true);
    CommonService.delete("ProductMaster", false, obj)
      .then(
        (res) => {
          if (res.isSuccess) {
            toast.success("Data has delete Successfully !!", "User Master");
            getData();
          } else {
            toast.error(res.errors[0], "Product Master")
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "Product Master")
        }
      ).finally(() => setLoading(false));
  }

  const getData = () => {
    setLoading(true);
    CommonService.getAll("ProductMaster", false)
      .then((res) => {
        if (res.isSuccess) {
          setData(res.data);
        } else {
          toast.error(res.errors[0], "Product Master");
        }
      },
        () => {
          toast.error("Something Went Wrong !!", "Product Master");
        }).finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  let columns = ['name', 'title', 'code', 'price', 'salePrice', 'discount', 'quantity', 'createdOn'];
  const tableCols = getColumns(columns, true, onEdit, onDelete)

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
                isSave={false}
                handleAddUser={handleAddUser}
                saveBtnTitle='Add Product'
              />
            </Spin>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default withNavigate(ProductList);
