import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Sidbar from "../Sidbar";
import AxiosWithAuth from "../../contexts/AxiosWithAuth";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null); // ✅ added for file selection

  const token = localStorage.getItem("token");

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
      author: "",
      date: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      image: Yup.string().nullable(),
      author: Yup.string().required("Required"),
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

        let uploadedImageUrl = values.image;

        // ✅ If file selected, upload and get URL
        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);

          const res = await AxiosWithAuth().post(
            "/api/v1/upload/single",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          uploadedImageUrl = res.data.fileUrl;
        }

        const payload = {
          ...values,
          image: uploadedImageUrl,
        };

        if (isEdit) {
          await AxiosWithAuth().put(`/api/v1/blogs/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await AxiosWithAuth().post("/api/v1/blogs", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        navigate("/dashboard/blogs");
      } catch (err) {
        console.error(err);
        alert("Failed to save blog. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchBlog = async () => {
        if (!token) {
          alert("You must be logged in to edit blogs");
          return;
        }
        try {
          const res = await AxiosWithAuth().get(`/api/v1/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const blog = res.data.data;

          formik.setValues({
            title: blog.title || "",
            category: blog.category || "",
            description: blog.description || "",
            image: blog.image || "",
            author: blog.author || "",
            date: blog.date
              ? new Date(blog.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          });
        } catch (err) {
          console.error(err);
          alert("Failed to load blog data.");
        }
      };
      fetchBlog();
    }
  }, [id, token]);
  return (
    <div>
      <Sidbar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"}`}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                )}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formik.touched.category && formik.errors.category ? "border-red-500" : "border-gray-300"}`}
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Investment">Investment</option>
                  <option value="Business">Business</option>
                  <option value="Consulting">Consulting</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
                )}
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formik.touched.author && formik.errors.author ? "border-red-500" : "border-gray-300"}`}
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.author && formik.errors.author && (
                  <p className="text-red-500-t-1">{formik.errors.author}</p>
                )}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formik.touched.date && formik.errors.date ? "border-red-500" : "border-gray-300"}`}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
                {formik.touched.image && formik.errors.image && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-y ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"}`}
                  rows={6}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
              ) : null}
              {loading ? "Processing..." : isEdit ? "Update Blog" : "Create Blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;