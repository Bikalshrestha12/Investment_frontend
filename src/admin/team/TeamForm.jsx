import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from "../Sidbar";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const TeamForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    // const [iconFile, setIconFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    // const [iconPreview, setIconPreview] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: {
            name: "",
            role: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            image: "",
            // icon: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Full name is required"),
            role: Yup.string().required("Role is required"),
            description: Yup.string().required("Description is required"),
            date: Yup.date().required("Date is required"),
            facebook: Yup.string().url("Enter a valid URL"),
            twitter: Yup.string().url("Enter a valid URL"),
            instagram: Yup.string().url("Enter a valid URL"),
            linkedin: Yup.string().url("Enter a valid URL"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let uploadedImage = values.image;
                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    const res = await AxiosWithAuth().post("/api/v1/upload/single", formData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    uploadedImage = res.data.fileUrl;
                }

                // let uploadedIcon = values.icon;
                // if (iconFile) {
                //     const formData = new FormData();
                //     formData.append("file", iconFile);
                //     const res = await axios.post("http://localhost:5000/api/v1/upload/single", formData, {
                //         headers: { Authorization: `Bearer ${token}` },
                //     });
                //     uploadedIcon = res.data.fileUrl;
                // }

                const payload = {
                    ...values,
                    image: uploadedImage,
                    // icon: uploadedIcon,
                };

                const url = isEdit
                    ? `/api/v1/team/${id}`
                    : `/api/v1/team`;

                const method = isEdit ? AxiosWithAuth().put : AxiosWithAuth().post;
                await method(url, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                navigate("/dashboard/teams");
            } catch (err) {
                console.error(err);
                alert("Error saving team member. Try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchTeamMember = async () => {
                try {
                    const res = await AxiosWithAuth().get(`/api/v1/team/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = res.data.data;
                    formik.setValues({
                        name: data.name || "",
                        role: data.role || "",
                        description: data.description || "",
                        image: data.image || "",
                        // icon: data.icon || "",
                        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
                        facebook: data.facebook || "",
                        twitter: data.twitter || "",
                        instagram: data.instagram || "",
                        linkedin: data.linkedin || "",
                    });

                    if (data.image) setImagePreview(data.image);
                    // if (data.icon) setIconPreview(data.icon);
                } catch (err) {
                    console.error("Failed to fetch team data", err);
                }
            };
            fetchTeamMember();
        }
    }, [id]);

    const socialFields = ["facebook", "twitter", "instagram", "linkedin"];

    return (
        <div>
            <Sidbar />
            <div className="flex-1 max-w-6xl mx-auto p-6">
                <div className="bg-white shadow rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
                        {isEdit ? "Edit Team Member" : "Add New Team Member"}
                    </h2>

                    <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className={`w-full p-3 border rounded ${formik.errors.name && formik.touched.name ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="text-red-500 text-sm">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-gray-700 mb-1">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                className={`w-full p-3 border rounded ${formik.errors.role && formik.touched.role ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.errors.role && formik.touched.role && (
                                <p className="text-red-500 text-sm">{formik.errors.role}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className={`w-full p-3 border rounded ${formik.errors.description && formik.touched.description ? "border-red-500" : "border-gray-300"}`}
                            ></textarea>
                            {formik.errors.description && formik.touched.description && (
                                <p className="text-red-500 text-sm">{formik.errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-700 mb-1">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full"
                            />
                            {imagePreview && <img src={imagePreview} alt="Image" className="mt-2 w-24 h-24 object-cover rounded shadow" />}
                        </div>

                        {/* Icon Upload */}
                        {/* <div>
                            <label className="block text-gray-700 mb-1">Icon</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setIconFile(file);
                                        setIconPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full"
                            />
                            {iconPreview && <img src={iconPreview} alt="Icon" className="mt-2 w-20 h-20 object-cover rounded shadow" />}
                        </div> */}

                        {/* Date */}
                        <div>
                            <label className="block text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                className={`w-full p-3 border rounded ${formik.errors.date && formik.touched.date ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.errors.date && formik.touched.date && (
                                <p className="text-red-500 text-sm">{formik.errors.date}</p>
                            )}
                        </div>

                        {/* Social Links */}
                        {socialFields.map((field) => (
                            <div key={field}>
                                <label className="block text-gray-700 mb-1 capitalize">{field} URL</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={formik.values[field]}
                                    onChange={formik.handleChange}
                                    className={`w-full p-3 border rounded ${formik.errors[field] && formik.touched[field] ? "border-red-500" : "border-gray-300"}`}
                                />
                                {formik.errors[field] && formik.touched[field] && (
                                    <p className="text-red-500 text-sm">{formik.errors[field]}</p>
                                )}
                            </div>
                        ))}

                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : isEdit ? "Update Team Member" : "Add Team Member"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamForm;
