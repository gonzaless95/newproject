import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AuthUIFunctions } from './AuthUIFunctions';
import Alert from '@src/components/alert/Alert';
import Icon from '@src/components/icon/Icon';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            username: '',
            email: '',
            password: '',
            password2: '',
            validUsername: true,
            validEmail: true,
            validPassword: true,
            validPassword2: true,
            errors: [],
            loading: false
        };
    }
    addError = (error) => {
        this.setState(prevState => ({
            errors: [...prevState.errors, error]
        }));
    }
    clearError = () => {
        this.setState(prevState => ({
            errors: [],
            validUsername: true,
            validEmail: true,
            validPassword: true,
            validPassword2: true
        }));
    }
    sendData = async () => {
        var isValid = true;
        this.clearError();

        if (!(this.state.username)){
            this.setState({ validUsername: false });
            this.addError('Please enter a valid username.');
            isValid = false;
        }
        if (!(this.state.email) || !AuthUIFunctions.validateEmail(this.state.email)){
            this.setState({ validEmail: false });
            this.addError('Please enter a valid email.');
            isValid = false;
        }
        if ( !(this.state.password)){
            this.setState({ validPassword: false });
            this.addError('Please enter a password.');
            isValid = false;
        }
        if ( !(this.state.password2)){
            this.setState({ validPassword2: false });
            this.addError('Please enter a password confirmation.');
            isValid = false;
        }
        if ((this.state.password && this.state.password2) &&  this.state.password != this.state.password2){
            this.setState({ validPassword: false });
            this.setState({ validPassword2: false });
            this.addError('Password and password confirmation should be the same.');
            isValid = false;
        }
        if (!isValid){
            return;
        }

        var data = {
            username: this.state.username,
            email: this.state.email, 
            password: this.state.password,
            password2: this.state.password2,
        };
        this.setState({ 
            loading: true 
        });
        try {
            let response = await axios.post('/api/auth/register', data);
            this.setState({ errors: AuthUIFunctions.handleResponse(response), loading: false});
            if (!response.data.result){
                this.setState({status: ''});
            }
        } catch(ex) {
            console.log('Exception occured trying to send the register request');
            console.log(ex);
            this.setState({ errors: ['Some error occured during this request... please try again.'], loading: false });
        }
    }
    handleChange = (event) =>  {
        this.setState({ [event.target.name]: event.target.value});
    }
    render(){
        return (
            <div className="form-container">
                <div className="text-center mb-2 mt-2">
                    <div className="auth-logo">
                        <img src="/static/media/logo.png" />
                    </div>
                </div>
                <div className="text-center mb-5 mt-3">
                    <h1>Please register</h1>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUserName">User name (visible to others)</label>
                    <input type="text" id="inputUserName" 
                        className={this.state.validUsername ? 'form-control' : 'form-control non-valid'} 
                        onChange={this.handleChange} name="username"
                        autoFocus />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmail">Email address</label>
                    <input type="email" id="inputEmail" 
                        className={this.state.validEmail ? 'form-control' : 'form-control non-valid'} 
                        onChange={this.handleChange} name="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" id="inputPassword" 
                        className={this.state.validPassword ? 'form-control' : 'form-control non-valid'}
                        onChange={this.handleChange} name="password" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Confirm password</label>
                    <input type="password" id="inputPassword2" 
                        className={this.state.validPassword2 ? 'form-control' : 'form-control non-valid'}
                        onChange={this.handleChange} name="password2" />
                </div>
                <div className="text-center mb-5 mt-5">
                    <div className="col-md-12">
                        <button className="btn btn-lg btn-primary" onClick={this.sendData} >
                            {this.state.loading ? <Icon icon="circle-notch" className="fa-spin" size="xs" spin /> : ''}
                            Create account
                        </button>
                    </div>
                </div>
                <div className="row text-center">
                    <p className="w-100">Already have an account? Sign in <Link to="/auth/login">here</Link>.</p>
                </div>
                { this.state.errors.length ? <Alert status={'error'} message={this.state.errors} /> : null }
            </div>
        );
    }
}