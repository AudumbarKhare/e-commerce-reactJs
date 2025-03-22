import React, { useEffect, useState } from 'react'
import { CommonService } from '../../../_services/Common.Service';
import { toast } from 'react-toastify';
import getColumns from '../../common/table/genColumns';
import { Card, Col, Row, Spin } from 'antd';
import { Tables } from '../../common/table/Tables';
import withNavigate from '../../../_helpers/WithNavigate';


const ProductList = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddProduct = () => {
    props.navigate(`/products/physical/addProduct`)
  }

  const onEdit = (row) => {
    props.navigate(`/products/physical/addProduct`, { state: { productId: row.id } });
  }

  const onDelete = (Id) => {
    let obj = { id: Id };
    CommonService.delete("ProductMaster", false, obj)
      .then(
        res => {
          if (res.isSuccess) {
            getData()
          } else {
            toast.error(res.errors[0], "Add Product");
          }
        },
        (error) => {
          toast.error("Someting Went Wrong !!", "Add Product");
        }
      )
  }

  const getData = () => {
    setLoading(true);
    CommonService.getAll("ProductMaster", false)
      .then(
        res => {
          if (res.isSuccess) {
            setData(res.data);
          } else {
            toast.error(res.errors[0], "Add Product")
          }
        },
        (error) => {
          toast.error("Someting Went Wrong !!", "Add Product")
        }
      ).finally(()=> setLoading(false))
  }

  useEffect(()=>{
    getData();
  },[])

  let columns = ['name', 'title', 'code', 'price', 'salePrice', 'discount', 'quantity', 'createdOn'];
  let tableCols = getColumns(columns, true, onEdit, onDelete);
  return (
    <>
      <div className='container-fluid'>
        <Row>
          <Col span={24}>
            <Card title='Product Master'>
              <Spin spinning={loading}>
                <Tables
                  data={data}
                  columns={tableCols}
                  onAdd={handleAddProduct}
                  saveBtnTitle="Add Product"
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default withNavigate(ProductList)
