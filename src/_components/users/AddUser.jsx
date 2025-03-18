import React, { useEffect, useState } from 'react';
import UserDetails from '../common/user/UserDetails';
import withNavigate from '../../_helpers/WithNavigate';
import withLocation from '../../_helpers/withLocation';
import { CommonService } from '../../_services/Common.Service';
import { toast, ToastContainer } from 'react-toastify';
import DbOperation from '../../_helpers/dbOperation';

const AddUser = (props) => {
  const [userInfo, setUserInfo] = useState({
    Id: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    UserTypeId: '',
    Status: '',
    Password: '',
    ConfirmPassword: '',
    btnTitle: 'Save',
    Operation: DbOperation.create
  });

  useEffect(() => {
    if (props.location.state && props.location.state.userId) {
      getUserById(props.location.state.userId);
    }
  }, [props.location.state]);

  const getUserById = (Id) => {
    CommonService.getById("UserMaster", false, Id).then(
      (res) => {
        if (res.isSuccess) {
          setUserInfo({
            Id: res.data.id,
            FirstName: res.data.firstName,
            LastName: res.data.lastName,
            Email: res.data.email,
            UserTypeId: res.data.userTypeId,
            Status: res.data.Status,
            Operation: DbOperation.update,
            btnTitle: 'Update',
            Password: '',
            ConfirmPassword: ''
          });
        } else {
          toast.error(res.errors[0], { toastId: "User " });
        }
      }
    ).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      <UserDetails userDetails={userInfo} />
      <ToastContainer />
    </div>
  );
};

export default withNavigate(withLocation(AddUser));