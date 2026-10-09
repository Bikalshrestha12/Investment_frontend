import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiEdit2, FiTag } from 'react-icons/fi';
import AxiosWithAuth, { resolveImage } from '../../contexts/AxiosWithAuth';
import { Badge, Card, Thumb } from '../ui';
import RichText from '../../components/common/RichText';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const backLink = (
        <Link to="/dashboard/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <FiArrowLeft /> Back to projects
        </Link>
    );

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl">
                {backLink}
                <Card className="animate-pulse p-6">
                    <div className="mb-6 h-72 rounded-lg bg-slate-200" />
                    <div className="mb-3 h-6 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                </Card>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="mx-auto max-w-4xl">
                {backLink}
                <Card className="p-10 text-center text-slate-500">Project not found.</Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            {backLink}
            <Card className="overflow-hidden">
                {project.image && (
                    <img src={resolveImage(project.image)} alt={project.title} className="h-72 w-full object-cover sm:h-96" />
                )}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                            {project.icon && <Thumb src={project.icon} alt="" size="h-12 w-12" rounded="rounded-xl" />}
                            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
                        </div>
                        <Link
                            to={`/dashboard/projectformedit/${project._id}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <FiEdit2 className="h-4 w-4" /> Edit project
                        </Link>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {project.category && (
                            <span className="inline-flex items-center gap-1.5"><FiTag /> <Badge>{project.category}</Badge></span>
                        )}
                        {project.createdAt && (
                            <span className="inline-flex items-center gap-1.5">
                                <FiCalendar /> Published {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h2>
                        <RichText html={project.description} className="leading-relaxed text-slate-700" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProjectDetailPage;
