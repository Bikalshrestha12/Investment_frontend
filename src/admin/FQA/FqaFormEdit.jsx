import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const FqaFormEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: {
            question: "",
            answer: "",
            date: new Date().toISOString().split("T")[0],
        },
        validationSchema: Yup.object({
            question: Yup.string().required("Required"),
            answer: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (!token) {
                    alert("You must be logged in to perform this action");
                    setLoading(false);
                    return;
                }

                if (isEdit) {
                    await AxiosWithAuth().put(
                        `/api/v1/faqs/${id}`,
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    await AxiosWithAuth().post(
                        "/api/v1/faqs",
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                navigate("/dashboard/faqs");
            } catch (err) {
                console.error(err);
                alert("Failed to save FAQS. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchFaqs = async () => {
                if (!token) {
                    alert("You must be logged in to edit FAQS");
                    return;
                }
                try {
                    const res = await AxiosWithAuth().get(`/api/v1/faqs/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const faqs = res.data.data;

                    formik.setValues({
                        question: faqs?.question ?? "",
                        answer: faqs?.answer ?? "",
                        date: faqs?.date
                            ? new Date(faqs.date).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0],
                    });
                } catch (err) {
                    console.error(err);
                    alert("Failed to load FAQs data.");
                }
            };
            fetchFaqs();
        }
    }, [id]);

    return (
        <div>
            <div>
                <Sidbar />
                <div className="max-w-4xl mx-auto">
                    <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-4xl font-bold mb-6 text-center">
                            {isEdit ? "Edit Services" : "Add New Services"}
                        </h2>
                        <form onSubmit={formik.handleSubmit} className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Title Field */}
                                <div className="col-span-1">
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        id="question"
                                        name="question"
                                        className={`mt-1 block w-full border ${formik.touched.question && formik.errors.question ? "border-red-500" : "border-gray-300"} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        value={formik.values.question}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.title && formik.errors.question && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.question}</p>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div className="col-span-1">
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                                        Answer
                                    </label>
                                    <textarea
                                        id="answer"
                                        name="answer"
                                        className={`mt-1 block w-full border ${formik.touched.answer && formik.errors.answer ? "border-red-500" : "border-gray-300"} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        rows={4}
                                        value={formik.values.answer}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.description && formik.errors.answer && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.answer}</p>
                                    )}
                                </div>

                                {/* Date Field */}
                                <div className="col-span-1 sm:col-span-1">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className={`mt-1 block w-full border ${formik.touched.date && formik.errors.date ? "border-red-500" : "border-gray-300"} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.date && formik.errors.date && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : isEdit ? (
                                    "Update FAQS"
                                ) : (
                                    "Add New FAQS"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FqaFormEdit