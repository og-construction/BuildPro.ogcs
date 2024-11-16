import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';

const VerifyOtpModal = ({ open, onClose, email }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await verifyOtp({ email, otp });
            navigate('/payment');
            onClose(); // Close dialog after successful submission
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'OTP verification failed');
            setOtp(''); // Reset OTP field after an error
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                    Verify OTP
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ mb: 2, color: 'text.secondary' }}
                >
                    Please enter the OTP sent to your email address:
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}
                >
                    {email}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    {errorMessage && (
                        <Typography color="error" variant="body2" align="center">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    px: 3,
                    pb: 3,
                }}
            >
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: 1.5,
                    }}
                >
                    Verify OTP
                </Button>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                    Didn’t receive the OTP?{' '}
                    <Button
                        color="secondary"
                        size="small"
                        sx={{ textTransform: 'none', fontWeight: 'medium' }}
                    >
                        Resend
                    </Button>
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default VerifyOtpModal;
