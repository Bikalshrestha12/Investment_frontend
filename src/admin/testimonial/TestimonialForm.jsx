import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from "../Sidbar";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const TestimonialForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
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
            text: "",
            image: "",
            profession: "",
            date: new Date().toISOString().split("T")[0],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            text: Yup.string().required("Text is required"),
            profession: Yup.string().required("Profession is required"),
            date: Yup.date().required("Date is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);

            try {
                let uploadedImageUrl = values.image;

                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);

                    const res = await AxiosWithAuth().post(
                        "/api/v1/upload/single",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    uploadedImageUrl = res.data.fileUrl;
                }

                const payload = {
                    ...values,
                    image: uploadedImageUrl,
                };

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const url = isEdit
                    ? `/api/v1/testimonials/${id}`
                    : "/api/v1/testimonials";

                const method = isEdit ? AxiosWithAuth().put : AxiosWithAuth().post;
                await method(url, payload, config);

                navigate("/dashboard/testimonials");
            } catch (err) {
                console.error(err);
                alert("Failed to save testimonial. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchTestimonial = async () => {
                try {
                    const res = await AxiosWithAuth().get(
                        `/api/v1/testimonials/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    const data = res.data.data;

                    formik.setValues({
                        name: data.name || "",
                        text: data.text || "",
                        image: data.image || "",
                        profession: data.profession || "",
                        date: data.createdAt
                            ? new Date(data.createdAt).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0],
                    });

                    if (data.image) {
                        setImagePreview(data.image);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Failed to load testimonial data.");
                }
            };
            fetchTestimonial();
        }
    }, [id]);

    return (
        <div>
            <Sidbar />
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
                    </h2>

                    <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className={`mt-1 w-full border rounded-md p-2 ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-sm">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Profession */}
                        <div>
                            <label className="block text-sm font-medium">Profession</label>
                            <input
                                type="text"
                                name="profession"
                                value={formik.values.profession}
                                onChange={formik.handleChange}
                                className={`mt-1 w-full border rounded-md p-2 ${formik.touched.profession && formik.errors.profession
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.profession && formik.errors.profession && (
                                <p className="text-red-500 text-sm">{formik.errors.profession}</p>
                            )}
                        </div>

                        {/* Image File Input */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.currentTarget.files[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-3 w-32 h-32 object-cover rounded border"
                                />
                            )}
                        </div>

                        {/* Text */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium">Testimonial</label>
                            <textarea
                                name="text"
                                rows={4}
                                value={formik.values.text}
                                onChange={formik.handleChange}
                                className={`mt-1 w-full border rounded-md p-2 ${formik.touched.text && formik.errors.text
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.text && formik.errors.text && (
                                <p className="text-red-500 text-sm">{formik.errors.text}</p>
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
                                className={`mt-1 w-full border rounded-md p-2 ${formik.touched.date && formik.errors.date
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <p className="text-red-500 text-sm">{formik.errors.date}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="sm:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                                {loading
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update Testimonial"
                                        : "Add Testimonial"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestimonialForm;
