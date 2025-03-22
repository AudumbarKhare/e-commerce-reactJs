import React, { useEffect, useState } from 'react'
import withNavigate from '../../_helpers/WithNavigate';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import getColumns from '../common/table/genColumns';
import { Spin, Row, Col, Card } from 'antd';
import { Tables } from '../common/table/Tables';

const ListUser = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddUser = () => {
    props.navigate(`/users/addUser`);
  }

  const onEdit = (row) => {
    props.navigate(`/users/addUser`, { state: { userId: row.id } });
  }

  const OnDelete = (Id) => {
    let obj = { id: Id };
    setLoading(true);
    CommonService.delete('UserMaster', false, obj).then(
      (res) => {
        if (res.isSuccess) {
          toast.success("User Delete Successfully !!");
          getData();
        } else {
          toast.error(res.errors[0], "User");
        }
      }).catch((error) => {
        console.error(`Something Went Wrong ${error}`, 'User');
      }).finally(()=>setLoading(false))
  }

  const getData = () => {
    setLoading(true);
    CommonService.getAll(`UserMaster`, false).then(
      (res) => {
        if (res.isSuccess) {
          setData(res.data);
        } else {
          toast.error(res.errors[0], "User");
        }
      }
    ).catch((error) => {
      console.error(error);
      toast.error("Someting Went Wrong !!", "User");
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    getData();
  }, []);

  let columns = ["firstName", "lastName", "email", "userType", "status", "createdOn"];
  let tableCols = getColumns(columns, true, onEdit, OnDelete)

  return (
    <div className='container-fluid'>
      <Row>
        <Col span={24}>
          <Card title='User Master'>
            <Spin spinning={loading}>
              <Tables
                data={data}
                columns={tableCols}
                onAdd={handleAddUser}
                saveBtnTitle='Add New User'
              />
            </Spin>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  )
}

export default withNavigate(ListUser);
