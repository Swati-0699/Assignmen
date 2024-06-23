import React, { useState } from 'react';
import '../Login/Login.css';
import { useNavigate } from 'react-router-dom';
import OpenEye from '../../Assets/Images/openEye.svg';
import CloseEye from '../../Assets/Images/closeEye.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    const handleLogin = async () => {
        if (!phone || !password) {
            toast.error('phone and Password are required.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8081/login', {
                phone,
                password
            });

            // Assuming your API responds with some data upon successful login
            console.log('Login successful:', response.data);

            if (response.data === 'success_admin') {

                // Redirect to landing page after successful login
                navigate('/landingPage');
            }


        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to login. Please try again later.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Handle error state, e.g., reset loading spinner
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className='loginPage commonBackgroundLogin'>
            <ToastContainer />
            {/* Below line is to set logging Page Image */}
            <div className='loginImageContainer'></div>

            <div className='logingContentContainer'>

                <div className='loginContentSection'>

                    <div className='loginContentMainBox'>

                        <div className='loginContentInputSection'>

                            <div className='inputSectionHeaderBox'>
                                <div className='inputSectionHeaderTxt'>Welcome back!</div>
                                <div className='inputSectionSubHeaderTxt'>Login to continue</div>
                            </div>

                            <div className='inputSectionFieldsBox'>

                                <div className='inputSectionFieldsRow'>
                                    <div className='inputFieldHeaderTxt'>Phone Number <span style={{ color: '#E06B6B' }}>*</span></div>
                                    <input className='inputFieldBox' placeholder='Enter Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>

                                <div className='inputSectionFieldsRow'>
                                    <div className='inputFieldHeaderTxt'>Password <span style={{ color: '#E06B6B' }}>*</span></div>
                                    <div className='passwordInputContainer'>
                                        <input className='inputFieldBox' type={showPassword ? 'text' : 'password'}
                                            placeholder='Enter Password'
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button className='eyeButton' onClick={togglePasswordVisibility}>
                                            <img src={showPassword ? OpenEye : CloseEye} alt='' className='eyeIcon' />
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div className='inputSectionForgetBox'>
                                <div className='inputSectionForgetTxt'>Forgot Password?</div>

                            </div>

                        </div>

                        <div className='loginContentButtonSection'>

                            <button className='loginBtnBox' onClick={handleLogin} disabled={loading}>
                                {loading ? (<CircularProgress size={20} style={{ color: 'white' }} />) : ('Login')}
                            </button>

                            {/* <div className='loginOrBox'>
                            <span className='lineSpan'></span>
                            <span className='orTxt'>or</span>
                            <span className='lineSpan'></span>
                            
                        </div> */}

                            {/* <div className='loginGoogleBox'>
                            <img src={GoogleIcon} alt=''/>
                            <span className='googleTxt'>Login with Google</span>
                        </div> */}

                        </div>

                    </div>

                    <div className='loginContentCopyRightBox'>
                        Copyright 2024
                    </div>

                </div>

            </div>

        </div>
    )
}
