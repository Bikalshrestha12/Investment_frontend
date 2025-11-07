// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { CiEdit } from "react-icons/ci";
// import { MdAdd, MdOutlineDeleteOutline } from 'react-icons/md';
// import { FaEye } from 'react-icons/fa';

// const ProjectPage = () => {
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredProjects, setFilteredProjects] = useState([]);

//     const projectsPerPage = 5; // Number of projects per page

//     // Fetch Projects
//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(
//                     `http://localhost:5000/api/v1/projects?page=${page}&limit=${projectsPerPage}`
//                 );
//                 setProjects(res.data.data);
//                 setTotalPages(res.data.totalPages); // Assuming API returns total pages info
//             } catch (error) {
//                 console.error("Error fetching projects:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProjects();
//     }, [page]);

//     // Search functionality
//     useEffect(() => {
//         if (searchTerm === '') {
//             setFilteredProjects(projects);
//         } else {
//             const filtered = projects.filter(
//                 (project) =>
//                     project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     project.category.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredProjects(filtered);
//         }
//     }, [searchTerm, projects]);

//     // Handle Delete
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/api/v1/projects/${id}`);
//             setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
//         } catch (error) {
//             console.error("Error deleting project:", error);
//         }
//     };

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <div>Loading...</div>
//             </div>
//         );
//     }

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h2 style={{ marginBottom: '20px' }} className='font-semibold text-4xl text-center my-4' >Project Management</h2>

//             {/* Add New Project Button and Search Input */}
//             <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Link
//                     to="/dashboard/projectform"
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         padding: '10px 15px',
//                         backgroundColor: '#1976d2',
//                         color: '#fff',
//                         textDecoration: 'none',
//                         borderRadius: '4px',
//                         transition: 'background-color 0.3s',
//                     }}
//                     onMouseOver={(e) => (e.target.style.backgroundColor = '#1565c0')}
//                     onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
//                 >
//                     <MdAdd className='me-2 text-black' size={30} /> Add New Project
//                 </Link>

//                 <input
//                     type="text"
//                     placeholder="Search Projects"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{
//                         padding: '8px 12px',
//                         borderRadius: '4px',
//                         border: '1px solid #ccc',
//                         width: '250px',
//                         fontSize: '14px',
//                     }}
//                 />
//             </div>

//             {/* Projects Table */}
//             <div style={{ overflowX: 'auto' }}>
//                 <table
//                     style={{
//                         width: '100%',
//                         borderCollapse: 'collapse',
//                         marginTop: '10px',
//                         backgroundColor: '#fff',
//                     }}
//                 >
//                     <thead>
//                         <tr style={{ backgroundColor: '#f2f2f2' }}>
//                             <th style={thStyle}>Title</th>
//                             <th style={thStyle}>Category</th>
//                             <th style={thStyle}>Description</th>
//                             <th style={thStyle}>Image</th>
//                             <th style={thStyle}>Icon</th>
//                             <th style={thStyle}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredProjects.map((project) => (
//                             <tr key={project._id}>
//                                 <td style={tdStyle}>{project.title}</td>
//                                 <td style={tdStyle}>{project.category}</td>
//                                 <td style={tdStyle}>{project.description.slice(0, 50)}...</td>
//                                 <td style={tdStyle}>
//                                     <img src={project.image} alt={project.title} style={{ width: '50px', height: 'auto', borderRadius: '4px' }} />
//                                 </td>
//                                 <td style={tdStyle}>
//                                     <img src={project.icon} alt={project.title} style={{ width: '30px', height: 'auto', borderRadius: '4px' }} />
//                                 </td>
//                                 <td style={{ ...tdStyle, textAlign: 'right' }}>
//                                     <Link
//                                         to={`/dashboard/projectformedit/${project._id}`}
//                                         style={actionButtonStyle('#4caf50')}
//                                         title="Edit"
//                                     >
//                                         <CiEdit />
//                                     </Link>
//                                     <Link
//                                         to={`/dashboard/projectdetailpage/${project._id}`}
//                                         style={actionButtonStyle('#2196f3')}
//                                         title="View"
//                                     >
//                                         <FaEye />
//                                     </Link>
//                                     <button
//                                         onClick={() => handleDelete(project._id)}
//                                         style={actionButtonStyle('#f44336')}
//                                         title="Delete"
//                                     >
//                                         <MdOutlineDeleteOutline />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Controls */}
//             <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 <button
//                     onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
//                     disabled={page === 1}
//                     style={{
//                         ...paginationButtonStyle,
//                         backgroundColor: page === 1 ? '#ccc' : '#1976d2',
//                         cursor: page === 1 ? 'not-allowed' : 'pointer',
//                     }}
//                 >
//                     Prev
//                 </button>
//                 <span style={{ padding: '0 15px', fontSize: '16px' }}>
//                     Page {page} of {totalPages}
//                 </span>
//                 <button
//                     onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
//                     disabled={page === totalPages}
//                     style={{
//                         ...paginationButtonStyle,
//                         backgroundColor: page === totalPages ? '#ccc' : '#1976d2',
//                         cursor: page === totalPages ? 'not-allowed' : 'pointer',
//                     }}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Basic styles
// const thStyle = {
//     padding: '12px',
//     textAlign: 'left',
//     borderBottom: '1px solid #ccc',
//     fontWeight: '600',
//     fontSize: '14px',
// };

// const tdStyle = {
//     padding: '12px',
//     borderBottom: '1px solid #eee',
//     fontSize: '14px',
// };

// const actionButtonStyle = (bgColor) => ({
//     marginRight: '8px',
//     padding: '6px 12px',
//     backgroundColor: bgColor,
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     textDecoration: 'none',
//     display: 'inline-block',
//     transition: 'background-color 0.3s',
// });

// const paginationButtonStyle = {
//     padding: '8px 16px',
//     backgroundColor: '#1976d2',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     margin: '0 5px',
//     transition: 'background-color 0.3s',
// };

// export default ProjectPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { MdAdd, MdOutlineDeleteOutline } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);

    // For modal
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const projectsPerPage = 5;

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await AxiosWithAuth().get(`/api/v1/projects?page=${page}&limit=${projectsPerPage}`);
                setProjects(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [page]);

    // Search
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(
                (project) =>
                    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchTerm, projects]);

    // Delete
    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth().delete(`/api/v1/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    // Image modal handlers
    const openImageModal = (imgUrl, projectId) => {
        setSelectedImage(imgUrl);
        setSelectedProjectId(projectId);
        setIsModalOpen(true);
        setNewImageFile(null);
        setPreviewImage(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setSelectedProjectId(null);
        setNewImageFile(null);
        setPreviewImage(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleImageSave = async () => {
        if (!newImageFile || !selectedProjectId) return;

        const formData = new FormData();
        formData.append('image', newImageFile);

        try {
            const res = await AxiosWithAuth().patch(
                `/api/v1/projects/${selectedProjectId}/updateImage`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const updatedImage = res.data.updatedImage;
            setProjects((prev) =>
                prev.map((p) =>
                    p._id === selectedProjectId ? { ...p, image: updatedImage } : p
                )
            );

            closeModal();
        } catch (err) {
            console.error("Error updating image:", err);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    return (
        <div>
            <Sidbar />

            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 className='font-semibold text-4xl text-center my-4'>Project Management</h2>

                {/* Header Actions */}
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                        to="/dashboard/projectform"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 15px',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        <MdAdd className='me-2 text-black' size={30} /> Add New Project
                    </Link>

                    <input
                        type="text"
                        placeholder="Search Projects"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '250px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Icon</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project._id}>
                                    <td style={tdStyle}>{project.title}</td>
                                    <td style={tdStyle}>{project.category}</td>
                                    <td style={tdStyle}>{project.description.slice(0, 50)}...</td>
                                    <td style={tdStyle}>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            style={{ width: '50px', cursor: 'pointer', borderRadius: '4px' }}
                                        // onClick={() => openImageModal(project.image, project._id)}
                                        />
                                    </td>
                                    <td style={tdStyle}>
                                        <img
                                            src={project.icon}
                                            alt={project.title}
                                            style={{ width: '30px', borderRadius: '4px' }}
                                        />
                                    </td>
                                    {/* <td style={{ ...tdStyle, textAlign: 'right' }}>
                                    <Link
                                        to={`/dashboard/projectformedit/${project._id}`}
                                        style={actionButtonStyle('#4caf50')}
                                        title="Edit"
                                    >
                                        <CiEdit className='text-white' />
                                    </Link>
                                    <Link
                                        to={`/dashboard/projectdetailpage/${project._id}`}
                                        style={actionButtonStyle('#2196f3')}
                                        title="View"
                                    >
                                        <FaEye />
                                    </Link>
                                    <button onClick={() => handleDelete(project._id)} style={actionButtonStyle('#f44336')} title="Delete">
                                        <MdOutlineDeleteOutline />
                                    </button>
                                </td> */}
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/projectformedit/${project._id}`}
                                            style={actionButtonStyle('#4caf50')}
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <Link
                                            to={`/dashboard/projectdetailpage/${project._id}`}
                                            style={actionButtonStyle('#2196f3')}
                                            title="View"
                                        >
                                            👁️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            style={actionButtonStyle('#f44336')}
                                            title="Delete"
                                        >
                                            <MdOutlineDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        style={{
                            ...paginationButtonStyle,
                            backgroundColor: page === 1 ? '#ccc' : '#1976d2',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Prev
                    </button>
                    <span style={{ padding: '0 15px' }}>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        style={{
                            ...paginationButtonStyle,
                            backgroundColor: page === totalPages ? '#ccc' : '#1976d2',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Next
                    </button>
                </div>

                {/* Image Modal */}
                {isModalOpen && (
                    <div style={modalOverlayStyle} onClick={closeModal}>
                        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                            <img
                                src={previewImage || selectedImage}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '4px' }}
                            />
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: '15px' }} />
                            <div style={{ marginTop: '15px' }}>
                                <button onClick={handleImageSave} style={{ ...modalButtonStyle, backgroundColor: '#4caf50' }}>Save</button>
                                <button onClick={closeModal} style={{ ...modalButtonStyle, backgroundColor: '#f44336' }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

// Styles
const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    fontWeight: '600',
    fontSize: '14px',
};

const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    fontSize: '11px',
};

const actionButtonStyle = (bgColor) => ({
    marginRight: '8px',
    padding: '6px 12px',
    backgroundColor: bgColor,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
});

const paginationButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 5px',
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
};

const modalButtonStyle = {
    margin: '10px',
    padding: '10px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default ProjectPage;
