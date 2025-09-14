'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { registerUser } from '@/app/services/authService'

const AuthRegister = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        agencyName: '',
        phone: '',
        city: '',
        state: '',
        pincode: '',
        officeAddress: '',
        officePhone: '',
        instagramLink: '',
        facebookLink: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const mandatoryFields = [
            'name', 'email', 'agencyName', 'phone', 'city', 'state',
            'pincode', 'officeAddress', 'officePhone', 'password', 'confirmPassword'
        ];

        for (const field of mandatoryFields) {
            if (!formData[field as keyof typeof formData]) {
                setError('All mandatory fields must be filled.');
                return;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await registerUser(
                formData.name,
                formData.email,
                formData.agencyName,
                formData.password,
                formData.phone,
                formData.city,
                formData.state,
                formData.pincode,
                formData.officeAddress,
                formData.officePhone,
                formData.instagramLink,
                formData.facebookLink
            );

            router.push('/authentication/login');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            minHeight="100vh"
            p={2}            
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                }}
            >
                <Typography fontWeight="700" variant="h4" mb={3} textAlign="center">
                    Create Account
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Row 1: Name & Email */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Full Name
                                </Typography>
                                <CustomTextField
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Email
                                </Typography>
                                <CustomTextField
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>
                        </Stack>

                        {/* Row 2: Agency & Phone */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Agency Name
                                </Typography>
                                <CustomTextField
                                    name="agencyName"
                                    value={formData.agencyName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Phone Number
                                </Typography>
                                <CustomTextField
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>
                        </Stack>

                        {/* Row 3: City, State, Pincode */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    City
                                </Typography>
                                <CustomTextField name="city" value={formData.city} onChange={handleChange} fullWidth />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    State
                                </Typography>
                                <CustomTextField name="state" value={formData.state} onChange={handleChange} fullWidth />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Pincode
                                </Typography>
                                <CustomTextField name="pincode" value={formData.pincode} onChange={handleChange} fullWidth />
                            </Box>
                        </Stack>

                        {/* Row 4: Office Address & Office Phone */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={2}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Office Address
                                </Typography>
                                <CustomTextField name="officeAddress" value={formData.officeAddress} onChange={handleChange} fullWidth />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Office Phone
                                </Typography>
                                <CustomTextField name="officePhone" value={formData.officePhone} onChange={handleChange} fullWidth />
                            </Box>
                        </Stack>

                        {/* Row 5: Instagram & Facebook */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Instagram
                                </Typography>
                                <CustomTextField name="instagramLink" value={formData.instagramLink} onChange={handleChange} fullWidth />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Facebook
                                </Typography>
                                <CustomTextField name="facebookLink" value={formData.facebookLink} onChange={handleChange} fullWidth />
                            </Box>
                        </Stack>

                        {/* Row 6: Password & Confirm Password */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Password
                                </Typography>
                                <CustomTextField name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
                            </Box>
                            <Box flex={1}>
                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                    Confirm Password
                                </Typography>
                                <CustomTextField name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} fullWidth />
                            </Box>
                        </Stack>

                        <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3 }}>
                            {loading ? 'Registering...' : 'Sign Up'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default AuthRegister;
