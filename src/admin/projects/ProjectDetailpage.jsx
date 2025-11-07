import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await AxiosWithAuth().get(`/api/v1/projects/${id}`);
                setProject(res.data.data);
            } catch (err) {
                console.error("Failed to load project details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found.</div>;

    const slideIn = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    };

    return (
        <div>
            <Sidbar />

            <motion.div
                ref={ref}
                variants={slideIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                style={{
                    padding: '30px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    fontFamily: 'Arial, sans-serif',
                    background: 'linear-gradient(135deg, #f0f4ff, #ffffff)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                >
                    {/* Project Image */}
                    <motion.div
                        style={{ margin: '12px 0', textAlign: 'center' }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                margin: '0 auto',
                                borderRadius: '12px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        />
                    </motion.div>

                    {/* Icon and Title Section with Background */}
                    <motion.div
                        style={{
                            background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                            padding: '20px',
                            borderRadius: '12px',
                            marginTop: '20px',
                            color: '#fff',
                        }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='flex' style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
                            <motion.img
                                src={project.icon}
                                alt="icon"
                                style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', padding: '6px' }}
                                whileHover={{ rotate: 10, scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <motion.h2
                                style={{ fontSize: '28px', fontWeight: '600', margin: 0 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                {project.title}
                            </motion.h2>
                        </div>
                    </motion.div>

                    {/* Metadata Section */}
                    <motion.div
                        className='flex justify-between p-4'
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '20px 10px',
                            marginTop: '20px',
                            flexWrap: 'wrap',
                            gap: '10px',
                        }}
                    >
                        <motion.p
                            style={{ fontSize: '18px', fontWeight: '500' }}
                            whileHover={{ scale: 1.02, color: '#1976d2' }}
                            transition={{ duration: 0.3 }}
                        >
                            <strong>Category:</strong> {project.category}
                        </motion.p>
                        <motion.p
                            style={{ fontSize: '18px', fontWeight: '500' }}
                            whileHover={{ scale: 1.02, color: '#1976d2' }}
                            transition={{ duration: 0.3 }}
                        >
                            <strong>Published:</strong> {new Date(project.createdAt).toLocaleDateString()}
                        </motion.p>
                    </motion.div>

                    {/* Description Section */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
                            padding: '15px 20px',
                            borderRadius: '10px',
                            marginTop: '15px',
                        }}
                    >
                        <motion.p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                            <strong style={{ fontSize: '20px' }}>Description:</strong> {project.description}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Back Link */}
                <div className='flex justify-between'>
                    <Link
                        to="/dashboard/projects"
                        style={{
                            display: 'inline-block',
                            marginTop: '30px',
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#004ba0')}
                        onMouseOut={(e) => (e.target.style.color = '#1976d2')}
                    >
                        ← Back to Projects
                    </Link>
                    <Link
                        to={`/dashboard/projectformedit/${project._id}`}
                        style={{
                            display: 'inline-block',
                            marginTop: '30px',
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#004ba0')}
                        onMouseOut={(e) => (e.target.style.color = '#1976d2')}
                    >
                        Edit to Projects<span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
                            ←
                        </span>
                    </Link>
                </div>
            </motion.div>

        </div>

    );
};

export default ProjectDetailPage;
