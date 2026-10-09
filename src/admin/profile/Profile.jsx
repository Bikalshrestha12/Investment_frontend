import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosWithAuth, { resolveImage } from "../../contexts/AxiosWithAuth";
import InvestmentSuccessTable from "../../components/InvestmentSuccessTable";
import Loading from "../../components/Loading";
import { useSession } from "../../auth/SessionProvider";
import { getToken, getUser, replaceToken } from "../../auth/session";

// The API sends error text in `error` (ErrorResponse) or `message` (other handlers).
const apiError = (err, fallback) =>
    err?.response?.data?.error || err?.response?.data?.message || fallback;


const inputClass = (hasError) =>
    `w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${hasError ? "border-red-500" : "border-gray-300"}`;

const Field = ({ label, name, formik, type = "text", disabled, hint }) => {
    const error = formik.touched[name] && formik.errors[name];
    return (
        <div>
            <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={disabled}
                className={inputClass(error)}
            />
            {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const { logout, updateUser } = useSession();
    const token = getToken();

    const [user, setUser] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);

    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const profileValues = (data) => ({
        fullName: data?.fullName || "",
        email: data?.email || "",
        phone: data?.phone || "",
        address: data?.address || "",
    });

    const formik = useFormik({
        initialValues: profileValues(null),
        validationSchema: Yup.object({
            fullName: Yup.string().trim().required("Full name is required"),
            // Optional on the server too; new accounts start without them.
            phone: Yup.string().trim().matches(/^[+\d\s()-]{7,20}$/, { message: "Enter a valid phone number", excludeEmptyString: true }),
            address: Yup.string().trim(),
        }),
        onSubmit: async (values) => {
            setSaving(true);
            try {
                let image = user?.image || "";

                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    const uploadRes = await AxiosWithAuth().post("/api/v1/upload/single", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    image = uploadRes.data.fileUrl;
                }

                // Email is not editable: the server ignores it on update.
                const res = await AxiosWithAuth().put("/api/v1/auth/update-profile", {
                    fullName: values.fullName.trim(),
                    phone: values.phone.trim(),
                    address: values.address.trim(),
                    image,
                });

                const updated = res.data?.data || { ...user, ...values, image };
                setUser(updated);
                setImagePreview(updated.image ? resolveImage(updated.image) : null);
                // Shared session copy, read by the Navbar and dashboard header in every tab.
                updateUser({ ...(getUser() || {}), ...updated });
                setImageFile(null);
                setEditMode(false);
                toast.success("Profile updated successfully!");
            } catch (err) {
                console.error(err);
                toast.error(apiError(err, "Failed to update profile."));
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
                .notOneOf([Yup.ref("currentPassword")], "New password must be different from the current one")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match")
                .required("Confirm your new password"),
        }),
        onSubmit: async (values) => {
            setPasswordSaving(true);
            setPasswordError("");
            try {
                const res = await AxiosWithAuth().put("/api/v1/auth/update-password", {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });
                // The server issues a fresh token after a password change.
                if (res.data?.token) replaceToken(res.data.token);
                passwordFormik.resetForm();
                setPasswordMode(false);
                toast.success("Password updated successfully!");
            } catch (err) {
                setPasswordError(apiError(err, "Failed to update password."));
            } finally {
                setPasswordSaving(false);
            }
        },
    });

    // Fetch user profile
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await AxiosWithAuth().get("/api/v1/auth/me");
                const data = res.data.data;
                setUser(data);
                setImagePreview(data.image ? resolveImage(data.image) : null);
                formik.setValues(profileValues(data));
            } catch (err) {
                console.error(err);
                setError(apiError(err, "Failed to fetch profile. Please try again."));
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Cleanup blob URL
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB.");
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const cancelEdit = () => {
        formik.resetForm({ values: profileValues(user) });
        setImagePreview(user?.image ? resolveImage(user.image) : null);
        setImageFile(null);
        setEditMode(false);
    };

    const cancelPassword = () => {
        passwordFormik.resetForm();
        setPasswordError("");
        setPasswordMode(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 py-20"><Loading text="Loading profile..." /></div>;
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-20 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const initial = (user?.fullName || user?.email || "?").charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Profile card */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                onError={() => setImagePreview(null)}
                                className="h-28 w-28 rounded-full border-4 border-blue-600 object-cover"
                            />
                        ) : (
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-600 bg-blue-100 text-4xl font-bold text-blue-700">
                                {initial}
                            </div>
                        )}
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">{user?.fullName}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            {user?.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                            {user?.address && <p className="text-sm text-gray-500">{user.address}</p>}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {!editMode && (
                                <button
                                    className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                disabled={saving}
                                className="rounded-md bg-red-500 px-5 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {editMode && (
                        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-4 border-t pt-6" noValidate>
                            <h3 className="text-xl font-semibold text-gray-700">Edit Details</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Full name" name="fullName" formik={formik} disabled={saving} />
                                <Field label="Email" name="email" type="email" formik={formik} disabled hint="Email can't be changed." />
                                <Field label="Phone (optional)" name="phone" formik={formik} disabled={saving} />
                                <Field label="Address (optional)" name="address" formik={formik} disabled={saving} />
                                <div className="sm:col-span-2">
                                    <label htmlFor="profileImage" className="mb-1 block text-sm font-medium text-gray-700">
                                        Profile photo
                                    </label>
                                    <input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={saving}
                                        className="w-full rounded-md border border-gray-300 p-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF or WebP, up to 5 MB.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={saving}
                                    className="rounded-md bg-gray-300 px-5 py-2 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Password card */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Password</h3>
                            <p className="text-sm text-gray-500">Change the password you use to sign in.</p>
                        </div>
                        {!passwordMode && (
                            <button
                                onClick={() => setPasswordMode(true)}
                                className="rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {passwordMode && (
                        <form onSubmit={passwordFormik.handleSubmit} className="mt-6 max-w-md space-y-4 border-t pt-6" noValidate>
                            <Field label="Current password" name="currentPassword" type="password" formik={passwordFormik} disabled={passwordSaving} />
                            <Field label="New password" name="newPassword" type="password" formik={passwordFormik} disabled={passwordSaving} hint="At least 6 characters." />
                            <Field label="Confirm new password" name="confirmPassword" type="password" formik={passwordFormik} disabled={passwordSaving} />

                            {passwordError && (
                                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{passwordError}</p>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                                >
                                    {passwordSaving ? "Updating..." : "Update Password"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelPassword}
                                    disabled={passwordSaving}
                                    className="rounded-md bg-gray-300 px-5 py-2 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <InvestmentSuccessTable />
        </div>
    );
};

export default Profile;
