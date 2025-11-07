import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdOutlineDeleteOutline } from "react-icons/md";
import AxiosWithAuth, { imageUpload } from "../contexts/AxiosWithAuth";
import InvestmentSuccessTable from "../components/InvestmentSuccessTable";
import Loading from "../components/Loading";

const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [user, setUser] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);

    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch user profile
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const res = await axios.get("http://localhost:5000/api/v1/auth/me",
                const res = await AxiosWithAuth().get("/api/v1/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data.data;
                setUser(data);
                setImagePreview(data.image || null);
                formik.setValues({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    // image: data.image || "",
                    image: typeof data?.image === "string" && data.image.trim() !== ""
                        ? `${imageUpload}/uploads/images/${encodeURIComponent(data.image.split('/').pop())}`
                        : assets?.projectdefaul0 || "",
                });

            } catch (err) {
                setError("Failed to fetch profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchUser();
    }, [token]);

    // Cleanup blob URL
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Image change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Formik form
    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            image: "",
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Full name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
            address: Yup.string().required("Address is required"),
        }),
        onSubmit: async (values) => {
            setSaving(true);
            try {
                let imageUrl = values.image;

                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);

                    const uploadRes = await AxiosWithAuth().post(
                        // "http://localhost:5000/api/v1/upload/single",
                        "/api/v1/upload/single",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    imageUrl = uploadRes.data.fileUrl;
                }

                const updatedData = { ...values, image: imageUrl };

                await AxiosWithAuth().put(
                    // "http://localhost:5000/api/v1/auth/update-profile",
                    "/api/v1/auth/update-profile",
                    updatedData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setUser(updatedData);
                setEditMode(false);
                setImageFile(null);
                alert("Profile updated successfully!");
            } catch (err) {
                console.error(err);
                alert(err?.response?.data?.message || "Failed to update profile.");
            } finally {
                setSaving(false);
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Current password is required"),
            newPassword: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("Confirm your new password"),
        }),
        onSubmit: async (values) => {
            setPasswordSaving(true);
            setPasswordMessage("");
            try {
                await AxiosWithAuth().put(
                    // "http://localhost:5000/api/v1/auth/update-password",
                    "/api/v1/auth/update-password",
                    values,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPasswordMessage("Password updated successfully!");
                passwordFormik.resetForm();
                setPasswordMode(false);
            } catch (err) {
                setPasswordMessage(
                    err.response?.data?.message || "Failed to update password."
                );
            } finally {
                setPasswordSaving(false);
            }
        },
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!loading && !user && !error) {
        return (
            <div className="text-center py-20 text-gray-500"> <Loading /> </div>
        );
    }
    // console.log(error)

    // if (error) {
    //     return (
    //         <div className="text-center py-20 text-red-500">
    //             {error}
    //             <br />
    //             <button
    //                 onClick={() => window.location.reload()}
    //                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    //             >
    //                 Retry
    //             </button>
    //         </div>
    //     );
    // }

    return (

        <>
            <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img
                            src={imagePreview || "/default-avatar.png"}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
                        />
                        <div className="flex-1 space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {user?.fullName}
                            </h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-gray-500 text-sm">{user?.phone}</p>
                            <p className="text-gray-500 text-sm">{user?.address}</p>

                            {!editMode && (
                                <button
                                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {editMode && (
                        <form
                            onSubmit={formik.handleSubmit}
                            className="mt-8 border-t pt-6 space-y-4"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                Edit Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    onChange={formik.handleChange}
                                    value={formik.values.fullName}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={saving}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={saving}
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    onChange={formik.handleChange}
                                    value={formik.values.phone}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={saving}
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    onChange={formik.handleChange}
                                    value={formik.values.address}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={saving}
                                />
                                <div className="col-span-2">
                                    <label className="block mb-1 font-medium text-gray-700">
                                        Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={saving}
                                        className="border rounded-md p-2 w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-5 py-2 rounded-md text-white ${saving
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        formik.setValues({
                                            fullName: user?.fullName || "",
                                            email: user?.email || "",
                                            phone: user?.phone || "",
                                            address: user?.address || "",
                                            image: user?.image || "",
                                        });
                                        setImagePreview(user?.image || null);
                                        setImageFile(null);
                                        setEditMode(false);
                                    }}
                                    className="bg-gray-300 px-5 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="flex justify-between">

                        {!passwordMode ? (
                            <div className="mt-10">
                                <button
                                    onClick={() => setPasswordMode(true)}
                                    className="relative inline-block px-4 py-2 font-medium text-white transition-all duration-500 ease-in-out bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg hover:bg-[length:200%_auto] hover:from-green-500 hover:to-green-400 hover:via-green-300 bg-[length:100%_100%] bg-gradient-to-r hover:scale-105 hover:shadow-xl hover:cursor-pointer"
                                >
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={passwordFormik.handleSubmit}
                                className="mt-10 border-t pt-6 space-y-4"
                            >
                                <h3 className="text-xl font-semibold text-gray-700">Change Password</h3>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    onChange={passwordFormik.handleChange}
                                    value={passwordFormik.values.currentPassword}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={passwordSaving}
                                />
                                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                                    <p className="text-red-500 text-sm">{passwordFormik.errors.currentPassword}</p>
                                )}

                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    onChange={passwordFormik.handleChange}
                                    value={passwordFormik.values.newPassword}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={passwordSaving}
                                />
                                {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                                    <p className="text-red-500 text-sm">{passwordFormik.errors.newPassword}</p>
                                )}

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    onChange={passwordFormik.handleChange}
                                    value={passwordFormik.values.confirmPassword}
                                    className="border px-4 py-2 rounded-md w-full"
                                    disabled={passwordSaving}
                                />
                                {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{passwordFormik.errors.confirmPassword}</p>
                                )}

                                {passwordMessage && (
                                    <p
                                        className={`text-sm ${passwordMessage.includes("success") ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {passwordMessage}
                                    </p>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={passwordSaving}
                                        className={`px-5 py-2 rounded-md text-white transition-all duration-500 ease-in-out hover:shadow-xl hover:cursor-pointer ${passwordSaving
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {passwordSaving ? "Updating..." : "Update Password"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            passwordFormik.resetForm();
                                            setPasswordMode(false);
                                        }}
                                        className="bg-gray-300 px-5 py-2 rounded-md transition-all duration-500 ease-in-out hover:bg-gray-400 hover:shadow-xl hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-10 text-right">
                            <button
                                onClick={handleLogout}
                                className="relative inline-block px-4 py-2 font-medium text-white transition-all duration-500 ease-in-out bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg hover:bg-[length:200%_auto] hover:from-red-500 hover:to-red-400 hover:via-red-300 bg-[length:100%_100%] bg-gradient-to-r hover:scale-105 hover:shadow-xl hover:cursor-pointer"
                                disabled={saving}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <InvestmentSuccessTable />

            </div>
        </>
    );
};

export default Profile;
