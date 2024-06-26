import React, { useState } from 'react';
import FormValidator from '../../_validators/FormValidator';
import { userService } from '../../_services/auth/Auth.Service';
import { toast } from 'react-toastify';
import { changeLoggedIn } from '../../_actions/User.Action';
import { connect } from 'react-redux';
import WithNavigate from '../../_helpers/WithNavigate';

const RegistrationFrom = (props) => {
    const registrationValidator = new FormValidator([
        {
            field: 'firstName',
            method: 'isEmpty',
            validWhen: false,
            message: 'First Name is required'
        },
        {
            field: 'lastName',
            method: 'isEmpty',
            validWhen: false,
            message: 'Last Name is required'
        },
        {
            field: 'email',
            method: 'isEmpty',
            validWhen: false,
            message: 'Email is required'
        },
        {
            field: 'email',
            method: 'isEmail',
            validWhen: true,
            message: 'Please enter a valid emal'
        },
        {
            field: 'password',
            method: 'isEmpty',
            validWhen: false,
            message: 'Password is required'
        },
        {
            field: 'confirmPassword',
            method: 'isEmpty',
            validWhen: false,
            message: 'Confirm Password is required'
        },
        {
            field: 'confirmPassword',
            method: passwordMatch,
            validWhen: true,
            message: 'Passwords must match'
        }
    ]);

    const [registrationState, setRegistrationState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        validation: registrationValidator.valid(),
        submitted: false
    });

    function passwordMatch(confirmPassword, state) {
        console.log(state.password===confirmPassword)
        return state.password === confirmPassword;
    }

    const handleRegistrationChange = (e) => {
        const { name, value } = e.target;
        setRegistrationState({
            ...registrationState,
            [name]: value
        });
    };

    const clearRegForm = () => {
        setRegistrationState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            validation: registrationValidator.valid(),
            submitted: false
        });
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const validation = registrationValidator.validate(registrationState, '');
        setRegistrationState({
            ...registrationState,
            validation,
            submitted: true
        });

        if (validation.isValid) {
            const { firstName, lastName, email, password } = registrationState;
            userService.register({ firstName, lastName, email, password })
                .then(
                    res => {
                        if (res.isSuccess) {
                            if (res.data === -1) {
                                toast.warning("EmailId already exists !!", "Registration");
                            } else {
                                toast.success("Registration has been done successfully !!", "Registration");
                                clearRegForm();
                                // Optionally navigate or perform other actions
                            }
                        } else {
                            toast.error(res.errors[0], "Registration");
                        }
                    },
                    error => {
                        toast.error("Something Went Wrong !!", "Registration");
                    }
                )
        }
    };

    const { firstName, lastName, email, password, confirmPassword, validation, submitted } = registrationState;
    const validationReg = submitted ? registrationValidator.validate(registrationState, '') : validation;

    return (
        <>
            <form className="form-horizontal auth-form" onSubmit={handleRegistrationSubmit}>
                <div className="form-group pb-2">
                    <input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        className={`form-control ${validationReg.firstName.isInvalid ? "has-error" : ""}`}
                        value={firstName}
                        onChange={handleRegistrationChange}
                    />
                    {validationReg.firstName.isInvalid && <div className='help-block'>{validationReg.firstName.message}</div>}
                </div>
                <div className="form-group pb-2">
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        className={`form-control ${validationReg.lastName.isInvalid ? "has-error" : ""}`}
                        value={lastName}
                        onChange={handleRegistrationChange}
                    />
                    {validationReg.lastName.isInvalid && <div className='help-block'>{validationReg.lastName.message}</div>}

                </div>
                <div className="form-group pb-2">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className={`form-control ${validationReg.email.isInvalid ? "has-error" : ""}`}
                        value={email}
                        onChange={handleRegistrationChange}
                    />
                    {validationReg.email.isInvalid && <div className='help-block'>{validationReg.email.message}</div>}
                </div>
                <div className="form-group pb-2">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className={`form-control ${validationReg.password.isInvalid ? "has-error" : ""}`}
                        value={password}
                        onChange={handleRegistrationChange}
                    />
                    {validationReg.password.isInvalid && <div className='help-block'>{validationReg.password.message}</div>}

                </div>
                <div className="form-group pb-2">
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className={`form-control ${validationReg.confirmPassword.isInvalid ? "has-error" : ""}`}
                        value={confirmPassword}
                        onChange={handleRegistrationChange}
                    />
                    {validationReg.confirmPassword.isInvalid && <div className='help-block'>{validationReg.confirmPassword.message}</div>}

                </div>
                <div className="form-button pb-2">
                    <button className="btn btn-primary" type="submit">Register</button>
                </div>
            </form>

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

export default connect(mapStateToProps,mapDispatchToProps)(WithNavigate(RegistrationFrom));
