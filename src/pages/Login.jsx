import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import AxiosWithAuth from '../contexts/AxiosWithAuth';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ fullName: '', email: '', password: '' });
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isForgotPassword) {
                // await axios.post('http://localhost:5000/api/v1/auth/reset-password'
                await AxiosWithAuth().post('/api/v1/auth/reset-password', {
                    email: resetEmail,
                    newPassword,
                });
                // alert('Password reset successful!');
                toast.success('Password reset successful!');
                setIsForgotPassword(false);
                return;
            }

            if (isLogin) {
                // const res = await axios.post('http://localhost:5000/api/v1/auth/login',{
                const res = await AxiosWithAuth().post('/api/v1/auth/login', {
                    email: formData.email,
                    password: formData.password,
                });

                const token = res.data.token;
                localStorage.setItem('token', token);

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                //  Fetch user data using the token
                // const userRes = await axios.get('http://localhost:5000/api/v1/auth/me',
                const userRes = await AxiosWithAuth().get(`/api/v1/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log(userRes)

                // const accessToken = data.token.access.access;
                // const user = userRes.data;
                // Cookies.set('authToken', user, { expires: 7 });
                // localStorage.setItem('token', user);
                // localStorage.setItem('user', JSON.stringify(user));

                const user = userRes.data.data;
                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    // toast.success("Logged in successfully!");
                } else {
                    console.error("Invalid user object:", user);
                }
                // Redirect based on user role
                const role = user?.role?.toLowerCase();
                navigate(role === 'admin' ? '/dashboard' : '/');
                // if (role === 'admin') {
                //     navigate('/dashboard');
                // } else {
                //     navigate('/');
                // }

            } else {
                // Registration API
                // await axios.post('http://localhost:5000/api/v1/auth/register', 

                await AxiosWithAuth().post('/api/v1/auth/register', {
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                });
                // alert('Registration successful! You can now log in.');
                toast.success("Registration successful! You can now log in.")
                setIsLogin(true);
            }

        } catch (err) {
            // const message = err.response?.data?.error || 'Something went wrong';
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                'Something went wrong';
            setError(message);
            // toast.error(message);
            alert(message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-animated">
                <div className="relative bg-black bg-opacity-80 p-8 rounded-xl text-white w-full max-w-md form-container">
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-400 to-transparent rounded-xl opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">
                            {isForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Register'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isForgotPassword ? (
                                <>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full p-2 bg-gray-800 rounded-lg input-field"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2 bg-gray-800 rounded-lg input-field"
                                        required
                                    />
                                </>
                            ) : (
                                <>
                                    {!isLogin && (
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={formData.fullName}
                                            onChange={onChange}
                                            className="w-full p-2 bg-gray-800 rounded-lg input-field"
                                            required
                                        />
                                    )}
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="username"
                                        value={formData.email}
                                        onChange={onChange}
                                        className="w-full p-2 bg-gray-800 rounded-lg input-field"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={onChange}
                                        className="w-full p-2 bg-gray-800 rounded-lg input-field"
                                        required
                                    />
                                    {isLogin && (
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                Remember me
                                            </label>
                                            <span
                                                onClick={() => {
                                                    setIsForgotPassword(true);
                                                    setError('');
                                                }}
                                                className="text-cyan-400 cursor-pointer hover:underline link-hover"
                                            >
                                                Forgot password?
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-2 bg-purple-900 rounded-lg btn-animated"
                            >
                                {loading
                                    ? 'Please wait...'
                                    : isForgotPassword
                                        ? 'Reset Password'
                                        : isLogin
                                            ? 'Login'
                                            : 'Register'}
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-gray-400">
                            {isForgotPassword ? (
                                <>
                                    Remembered your password?{' '}
                                    <span
                                        onClick={() => {
                                            setIsForgotPassword(false);
                                            setIsLogin(true);
                                        }}
                                        className="text-cyan-400 cursor-pointer hover:underline link-hover"
                                    >
                                        Go back to login
                                    </span>
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Don't have an account?" : 'Already registered?'}
                                    <span
                                        onClick={toggleForm}
                                        className="text-cyan-400 cursor-pointer hover:underline link-hover ml-1"
                                    >
                                        {isLogin ? 'Register' : 'Login'}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </>
    );
};

export default Login;
