import React, { useEffect, useState } from 'react';
import { CommonService } from '../../_services/Common.Service';
import { toast } from 'react-toastify';
import getColumns from '../common/table/genColumns';
import { Col, Row, Spin } from 'antd';
import { Tables } from '../common/table/Tables';
import withNavigate from '../../_helpers/WithNavigate';

const ListUser = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddUser = () => {
    props.navigate(`/users/addUser`)
  };

  const onEdit = (row) => {
    props.navigate(`/users/addUser`, { state: { objRow: row } });
  }

  const onDelete = (Id) => {
    const obj = { id: Id };
    setLoading(true);
    CommonService.delete("UserMaster", false, obj)
      .then(
        (res) => {
          if (res.isSuccess) {
            toast.success("Data has delete Successfully !!", "User Master");
            getData();
          } else {
            toast.error(res.errors[0], "User Master")
          }
        },
        () => {
          toast.error("Something Went Wrong !!", "User Master")
        }
      ).finally(() => setLoading(false));
  }

  const getData = () => {
    setLoading(true);
    CommonService.getAll("UserMaster", false)
      .then((res) => {
        if (res.isSuccess) {
          setData(res.data);
        } else {
          toast.error(res.errors[0], "User Master");
        }
      },
        () => {
          toast.error("Something Went Wrong !!", "User Master");
        }).finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = ['firstName', 'lastName', 'email', 'userType', 'createdOn'];
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
                saveBtnTitle='Add User'
              />
            </Spin>
          </Col>
        </Row>
      </div>
    </>

  )
}

export default withNavigate(ListUser);
