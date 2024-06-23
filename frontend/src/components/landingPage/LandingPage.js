import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../LandingPage/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../Assets/Images/editIcon.svg';
import DeleteIcon from '../../Assets/Images/deleteIcon.svg';
import Close from "../../Assets/Images/whiteCross.svg";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage() {
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        phone: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleOpenDialog = (data) => {
        if (data) {
            setFormData(data);
            setEditMode(true);
            setCurrentUserId(data.id);
        } else {
            setFormData({
                name: '',
                email: '',
                gender: '',
                phone: ''
            });
            setEditMode(false);
            setCurrentUserId(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: '',
            email: '',
            gender: '',
            phone: ''
        });
    };

    const handleGoToLogin = () => {
        navigate('/');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getAllUsers`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleFormSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.gender || !formData.email) {
            toast.error('enter required details.', {
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
        try {
            if (editMode) {
                // const updatedData = {...formData,currentUserId};
                await axios.put(`http://localhost:8081/adminEditUser`, formData);
            } else {
                await axios.post('http://localhost:8081/adminAddUser', formData);
            }
            handleCloseDialog();
            fetchUserData();
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.put(`http://localhost:8081/adminDeleteUser/${userId}`);
            fetchUserData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className='landingPage'>
            <ToastContainer />
            <div className='landingPageContainer'>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #a8b4d4' }}>
                    <div className='headerRow'>User Details</div>
                    <button className='primaryBtn' style={{ background: 'red' }} onClick={handleGoToLogin}>Logout</button>
                </div>

                <div className='contentSection'>
                    <div className='buttonRow'>
                        <button className='primaryBtn' onClick={() => handleOpenDialog(null)}>Add Details</button>
                    </div>

                    <Dialog open={openDialog}>
                        <DialogTitle className='dialogTitle'>
                            <span className='dialogTitleTxt'>{editMode ? 'Edit Details' : 'Add Details'}</span>
                            <button style={{ cursor: "pointer", border: "none", background: "none", zIndex: "999" }} onClick={handleCloseDialog}><img src={Close} alt="cross icon" /> </button>
                        </DialogTitle>

                        <DialogContent style={{ padding: "14px", width: "500px", height: "180px", display: "flex", flexDirection: "column", gap: '20px' }}>
                            <div className='dialogContainer'>
                                <div className='dialogInputBox'>
                                    <div className='inputLabelB'>Name <span className='inputLabelMandatory'>*</span></div>
                                    <input
                                        className='inputField'
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className='dialogInputBox'>
                                    <div className='inputLabelB'>Email <span className='inputLabelMandatory'>*</span></div>
                                    <input
                                        className='inputField'
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className='dialogContainer'>
                                <div className='dialogInputBox'>
                                    <div className='inputLabelB'>Gender <span className='inputLabelMandatory'>*</span></div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <label>
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Male'
                                                checked={formData.gender === 'Male'}
                                                onChange={handleInputChange}
                                            /> Male
                                        </label>
                                        <label>
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Female'
                                                checked={formData.gender === 'Female'}
                                                onChange={handleInputChange}
                                            /> Female
                                        </label>
                                        <label>
                                            <input
                                                type='radio'
                                                name='gender'
                                                value='Other'
                                                checked={formData.gender === 'Other'}
                                                onChange={handleInputChange}
                                            /> Other
                                        </label>
                                    </div>
                                </div>

                                <div className='dialogInputBox'>
                                    <div className='inputLabelB'>Phone No. <span className='inputLabelMandatory'>*</span></div>
                                    <input
                                        className='inputField'
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </DialogContent>

                        <DialogActions style={{ justifyContent: "center" }}>
                            <button className='secondaryBtn' onClick={handleCloseDialog}>Cancel</button>
                            <button className='primaryBtn' onClick={handleFormSubmit}>{editMode ? 'Update' : 'Add'}</button>
                        </DialogActions>
                    </Dialog>

                    <div className='tableContainer'>
                        <table className="tableStructure">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Phone No.</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>{user.name}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={EditIcon} alt='' onClick={() => handleOpenDialog(user)} style={{ cursor: 'pointer' }} />
                                                <img src={DeleteIcon} alt='' style={{ cursor: 'pointer' }} onClick={() => handleDeleteUser(user.user_id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
