import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from "../Sidbar";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const ServicesFormEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");

    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [iconFile, setIconFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [iconPreview, setIconPreview] = useState("");

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token]);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            image: "",
            icon: "",
            date: new Date().toISOString().split("T")[0],
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
            date: Yup.date().required("Date is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);

            try {
                let uploadedImageUrl = values.image;
                let uploadedIconUrl = values.icon;

                // Upload image
                if (imageFile) {
                    const imgData = new FormData();
                    imgData.append("file", imageFile);
                    const res = await AxiosWithAuth().post("/api/v1/upload/single", imgData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    uploadedImageUrl = res.data.fileUrl;
                }

                // Upload icon
                if (iconFile) {
                    const iconData = new FormData();
                    iconData.append("file", iconFile);
                    const res = await AxiosWithAuth().post("/api/v1/upload/single", iconData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    uploadedIconUrl = res.data.fileUrl;
                }

                const payload = {
                    ...values,
                    image: uploadedImageUrl,
                    icon: uploadedIconUrl,
                };

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const url = isEdit
                    ? `/api/v1/services/${id}`
                    : "/api/v1/services";
                const method = isEdit ? AxiosWithAuth().put : AxiosWithAuth().post;

                await method(url, payload, config);
                navigate("/dashboard/services");
            } catch (error) {
                console.error(error);
                alert("Failed to save service. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchService = async () => {
                try {
                    const res = await AxiosWithAuth().get(`/api/v1/services/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = res.data.data;
                    formik.setValues({
                        title: data.title || "",
                        description: data.description || "",
                        image: data.image || "",
                        icon: data.icon || "",
                        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
                    });

                    setImagePreview(data.image);
                    setIconPreview(data.icon);
                } catch (error) {
                    console.error(error);
                    alert("Failed to load service data.");
                }
            };
            fetchService();
        }
    }, [id]);

    return (
        <div>
            <div>
                <Sidbar />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-3xl font-bold text-center mb-6">
                            {isEdit ? "Edit Service" : "Add New Service"}
                        </h2>

                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-red-500 text-sm">{formik.errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    rows={4}
                                    className={`mt-1 block w-full border rounded-md p-2 ${formik.touched.description && formik.errors.description
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="text-red-500 text-sm">{formik.errors.description}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium">Upload Image</label>
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover border rounded" />
                                )}
                            </div>

                            {/* Icon Upload */}
                            <div>
                                <label className="block text-sm font-medium">Upload Icon</label>
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {iconPreview && (
                                    <img src={iconPreview} alt="Preview" className="mt-2 w-16 h-16 object-cover border rounded" />
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formik.values.date}
                                    onChange={formik.handleChange}
                                    className={`mt-1 block w-full border rounded-md p-2 ${formik.touched.date && formik.errors.date ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {formik.touched.date && formik.errors.date && (
                                    <p className="text-red-500 text-sm">{formik.errors.date}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {loading ? "Saving..." : isEdit ? "Update Service" : "Add Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesFormEdit