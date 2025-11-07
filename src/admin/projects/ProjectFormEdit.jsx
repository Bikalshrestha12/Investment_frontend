import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from '../Sidbar';
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const ProjectFormEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [iconFile, setIconFile] = useState(null);

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    // Fetch project data if editing
    useEffect(() => {
        if (!id || !token) return;

        setIsEdit(true);

        const fetchProject = async () => {
            try {
                const res = await AxiosWithAuth().get(`/api/v1/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
            } catch (err) {
                console.error("Failed to load project:", err);
                alert("Failed to load project data.");
            }
        };

        fetchProject();
    }, [id, token]);

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
            image: Yup.string().required("Required"),
            icon: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (!token) {
                    alert("You must be logged in.");
                    return;
                }

                const uploadFile = async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await AxiosWithAuth().post(
                        "/api/v1/upload/single",
                        formData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return response.data.fileUrl;
                };

                const uploadedImageUrl = imageFile ? await uploadFile(imageFile) : values.image;
                const uploadedIconUrl = iconFile ? await uploadFile(iconFile) : values.icon;

                const payload = {
                    ...values,
                    image: uploadedImageUrl,
                    icon: uploadedIconUrl,
                };

                if (isEdit) {
                    await AxiosWithAuth().put(`/api/v1/projects/${id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else {
                    await AxiosWithAuth().post("/api/v1/projects", payload, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }

                navigate("/dashboard/projects");
            } catch (error) {
                console.error("Submit error:", error);
                alert(error?.response?.data?.message || "Failed to save project.");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div>
            <Sidbar />
            <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? "Edit Project" : "Add New Project"}</h2>

                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Title"
                        id="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && formik.errors.title}
                    />

                    <SelectField
                        label="Category"
                        id="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.category && formik.errors.category}
                    />

                    <TextAreaField
                        label="Description"
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && formik.errors.description}
                    />

                    <FileUpload
                        label="Upload Image"
                        file={imageFile}
                        existingUrl={formik.values.image}
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    <FileUpload
                        label="Upload Icon"
                        file={iconFile}
                        existingUrl={formik.values.icon}
                        onChange={(e) => setIconFile(e.target.files[0])}
                    />

                    <InputField
                        label="Date"
                        id="date"
                        type="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.date && formik.errors.date}
                    />

                    <div className="col-span-1 sm:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update Project" : "Add Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// InputField component
const InputField = ({ label, id, type = "text", value, onChange, onBlur, error }) => (
    <div className="col-span-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`mt-1 block w-full border rounded-md p-2 ${error ? "border-red-500" : "border-gray-300"
                }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// SelectField component
const SelectField = ({ label, id, value, onChange, onBlur, error }) => (
    <div className="col-span-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`mt-1 block w-full border rounded-md p-2 ${error ? "border-red-500" : "border-gray-300"
                }`}
        >
            <option value="">Select a category</option>
            <option value="Investment">Investment</option>
            <option value="Business">Business</option>
            <option value="Consulting">Consulting</option>
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// TextAreaField component
const TextAreaField = ({ label, id, value, onChange, onBlur, error }) => (
    <div className="col-span-1 sm:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            rows={4}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`mt-1 block w-full border rounded-md p-2 ${error ? "border-red-500" : "border-gray-300"
                }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

// FileUpload component
const FileUpload = ({ label, file, existingUrl, onChange }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type="file" accept="image/*" onChange={onChange} />
        {file ? (
            <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 h-24 object-contain" />
        ) : existingUrl ? (
            <img src={existingUrl} alt="Uploaded" className="mt-2 h-24 object-contain" />
        ) : null}
    </div>
);

export default ProjectFormEdit;
