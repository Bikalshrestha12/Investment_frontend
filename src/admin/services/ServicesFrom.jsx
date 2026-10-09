import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";
import { Skeleton } from '../../components/common/Skeleton';
import { Field } from '../content/shared';
import { FormPage } from '../ui';

const RichTextEditor = lazy(() => import('../content/RichTextEditor'));

const ServicesForm = () => {
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
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
            // The API rejects a service without an image.
            image: Yup.string().required("Image is required"),
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
                const data = error.response?.data;
                alert(data?.error || data?.message || "Failed to save service. Please try again.");
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
        <FormPage
            title={isEdit ? "Edit Service" : "Add Service"}
            backTo="/dashboard/services"
            backLabel="services"
        >

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
                {/* <div className="md:col-span-2">
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
                        </div> */}
                <Field
                    label="Description"
                    required
                    className="md:col-span-2"
                    error={formik.touched.description && formik.errors.description}
                >
                    <Suspense fallback={<Skeleton className="h-72 w-full rounded-lg" />}>
                        <RichTextEditor
                            value={formik.values.description}
                            onChange={(html) => formik.setFieldValue('description', html)}
                            onBlur={() => formik.setFieldTouched('description', true)}
                            invalid={!!(formik.touched.description && formik.errors.description)}
                            placeholder="Describe this service..."
                        />
                    </Suspense>
                </Field>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium">Upload Image <span className="text-red-500" aria-hidden="true">*</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                setImagePreview(URL.createObjectURL(file));
                                // Replaced by the uploaded file's address when the form is saved.
                                formik.setFieldValue("image", file.name);
                            }
                        }}
                        className={`mt-1 block w-full border rounded-md p-2 ${formik.touched.image && formik.errors.image ? "border-red-500" : "border-gray-300"}`}
                    />
                    {formik.touched.image && formik.errors.image && (
                        <p className="text-red-500 text-sm">{formik.errors.image}</p>
                    )}
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
        </FormPage>
    );
};

export default ServicesForm;
