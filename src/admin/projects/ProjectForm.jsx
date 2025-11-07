import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from '../Sidbar';
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const ProjectForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [iconFile, setIconFile] = useState(null);

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: "",
            image: "",
            icon: "",
            date: new Date().toISOString().split("T")[0],
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Required"),
            category: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);

            try {
                if (!token) {
                    alert("You must be logged in to perform this action");
                    setLoading(false);
                    return;
                }


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

                let uploadedIconUrl = values.icon;
                if (iconFile) {
                    const formData = new FormData();
                    formData.append("file", iconFile);

                    const res = await AxiosWithAuth().post(
                        "/api/v1/upload/single",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    uploadedIconUrl = res.data.fileUrl;
                }

                const payload = {
                    ...values,
                    image: uploadedImageUrl,
                    icon: uploadedIconUrl,
                };

                if (isEdit) {
                    await AxiosWithAuth().put(
                        `/api/v1/projects/${id}`,
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    await AxiosWithAuth().post("/api/v1/projects", payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                navigate("/dashboard/projects");
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to save project. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });


    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchProject = async () => {
                try {
                    const res = await AxiosWithAuth().get(
                        `/api/v1/projects/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const project = res.data.data;

                    formik.setValues({
                        title: project.title || "",
                        category: project.category || "",
                        description: project.description || "",
                        image: project.image || "",
                        icon: project.icon || "",
                        date: project.date
                            ? new Date(project.date).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0],
                    });
                } catch (error) {
                    console.error(error);
                    alert("Failed to load project data.");
                }
            };

            fetchProject();
        }
    }, [id, token]);

    return (
        <div>
            <Sidbar />

            <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">
                    {isEdit ? "Edit Project" : "Add New Project"}
                </h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <InputField
                            label="Title"
                            id="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && formik.errors.title}
                        />

                        {/* Category */}
                        <div className="col-span-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                className={`mt-1 block w-full border ${formik.touched.category && formik.errors.category
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-md p-2`}
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select a category</option>
                                <option value="Investment">Investment</option>
                                <option value="Business">Business</option>
                                <option value="Consulting">Consulting</option>
                            </select>
                            {formik.touched.category && formik.errors.category && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-1">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className={`mt-1 block w-full border ${formik.touched.description && formik.errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-md p-2`}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <FileUpload
                            label="Upload Image"
                            file={imageFile}
                            existingUrl={formik.values.image}
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />

                        {/* Icon Upload */}
                        <FileUpload
                            label="Upload Icon"
                            file={iconFile}
                            existingUrl={formik.values.icon}
                            onChange={(e) => setIconFile(e.target.files[0])}
                        />

                        {/* Date */}
                        <InputField
                            label="Date"
                            id="date"
                            type="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.date && formik.errors.date}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Saving..." : isEdit ? "Update Project" : "Add Project"}
                    </button>
                </form>
            </div>

        </div>
    );
};


const InputField = ({ label, id, type = "text", value, onChange, onBlur, error }) => (
    <div className="col-span-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            className={`mt-1 block w-full border ${error ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);


const FileUpload = ({ label, file, existingUrl, onChange }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type="file" accept="image/*" onChange={onChange} />
        {file ? (
            <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 h-24" />
        ) : existingUrl ? (
            <img src={existingUrl} alt="Uploaded" className="mt-2 h-24" />
        ) : null}
    </div>
);

export default ProjectForm;
