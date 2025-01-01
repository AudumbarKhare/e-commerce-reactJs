import React, { useState } from 'react';
import FormValidator from '../../_validators/FormValidator'
import { userService } from '../../_services/auth/Auth.Service';
import { connect } from 'react-redux';
import { changeLoggedIn } from '../../_actions/User.Action';
import { toast } from 'react-toastify';
import WithNavigate from '../../_helpers/WithNavigate';
import { Spin } from 'antd';

const LoginFrom = (props) => {
    const [loading, setLoading] = useState(false);

    const longinValidator = new FormValidator([
        {
            field: 'userName',
            method: 'isEmpty',
            validWhen: false,
            message: 'UserName is required'
        },
        {
            field: 'userName',
            method: 'isEmail',
            validWhen: true,
            message: 'Please enter valid Email'
        },
        {
            field: 'password',
            method: 'isEmpty',
            validWhen: false,
            message: 'Password is required'
        }
    ]);

    const [loginState, setLoginState] = useState({
        userName: '',
        password: '',
        validation: longinValidator.valid(),
        submitted: false
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginState({
            ...loginState,
            [name]: value
        })
    };

    const clearLoginForm = () => {
        setLoginState({
            userName: '',
            password: '',
            validation: longinValidator.valid(),
            submitted: false
        });
    };

    const handleLoginSubmit = (e) => {
       
        e.preventDefault();
        const validation = longinValidator.validate(loginState, '');
        setLoginState({
            ...loginState,
            validation,
            submitted: true
        });
        const { userName, password } = loginState;
        if (validation.isValid) {
            setLoading(true);
            userService.login(userName, password)
                .then(
                    res => {
                        if (res.isSuccess) {
                            localStorage.setItem("userDetails", JSON.stringify(res.data));
                            props.setLoggedIn(true, res.data);
                            clearLoginForm();
                            props.navigate('/dashboard')
                        }else{
                            toast.error(res.errors[0])
                        }
                    },
                    (error) => {
                        toast.error("Invalid Credentials !!", "Login");
                        localStorage.clear();
                        clearLoginForm();
                    }
                ).finally(() => setLoading(false))
        }
    };

    const { userName, password, validation, submitted } = loginState;
    let validationLogin = submitted ? longinValidator.validate(loginState, '') : validation;

    return (
        <>
        <Spin spinning={loading}>
            <form className="form-horizontal auth-form" onSubmit={handleLoginSubmit}>
                <div className='form-group pb-2'>
                    <input
                        name="userName"
                        type="email"
                        placeholder="Username"
                        className={`form-control ${validationLogin.userName.isInvalid ? "has-error" : ""}`}
                        value={userName}
                        onChange={handleLoginChange}
                    />
                    {validationLogin.userName.isInvalid && <div className='help-block'>{validationLogin.userName.message}</div>}
                </div>
                <div className='form-group pb-2'>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className={`form-control ${validationLogin.password.isInvalid ? "has-error" : ""}`}
                        value={password}
                        onChange={handleLoginChange}
                    />
                    {validationLogin.password.isInvalid && <div className='help-block'>{validationLogin.password.message}</div>}
                </div>
                <div className="form-button pb-2">
                    <button className="btn btn-primary" type="submit" >Login</button>
                </div>
            </form>
            </Spin>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: (isLoggedIn, user) => {
            dispatch(changeLoggedIn(isLoggedIn, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithNavigate(LoginFrom));
