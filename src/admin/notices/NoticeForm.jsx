import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/content';
import { AdminPageSkeleton, Skeleton } from '../../components/common/Skeleton';
import { ErrorBanner, FormPage } from '../ui';
import { Field, FormActions, FormikField } from '../content/shared';
import { PublishFields, SlugField } from '../content/PublishPanel';
import { PdfField } from '../content/uploads';
import { CategorySelect } from '../content/taxonomy';
import {
    errorMessage, fromDateTimeInput, SLUG_MESSAGE, SLUG_PATTERN, toDateTimeInput, useEditItem,
} from '../content/hooks';

// The editor is the largest part of this form, so it is downloaded only when a form opens.
const RichTextEditor = lazy(() => import('../content/RichTextEditor'));

const schema = Yup.object({
    title: Yup.string().trim().required('Title is required').max(200, 'Title cannot be longer than 200 characters'),
    slug: Yup.string().matches(SLUG_PATTERN, { message: SLUG_MESSAGE, excludeEmptyString: true }).max(80, 'Slug cannot be longer than 80 characters'),
    excerpt: Yup.string().max(500, 'Excerpt cannot be longer than 500 characters'),
});

const emptyValues = {
    title: '', slug: '', excerpt: '', content: '', category: '', featured: false, status: 'draft', publishedAt: '',
};

const toValues = (item) => ({
    title: item.title || '',
    slug: item.slug || '',
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category?._id || '',
    featured: !!item.featured,
    status: item.status || 'draft',
    publishedAt: toDateTimeInput(item.publishedAt),
});

// Create and edit form for notices (/dashboard/noticeform and /dashboard/noticeformedit/:id).
const NoticeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { item, loading, error: loadError } = useEditItem('notices', id);
    const [saveError, setSaveError] = useState(null);
    // The PDF is uploaded to the media library straight away; the notice keeps a reference to it.
    const [attachment, setAttachment] = useState(null);

    useEffect(() => { setAttachment(item?.attachment || null); }, [item]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: item ? toValues(item) : emptyValues,
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSaveError(null);
            const payload = {
                ...values,
                title: values.title.trim(),
                publishedAt: fromDateTimeInput(values.publishedAt),
                attachment: attachment?._id || null,
            };
            try {
                if (id) await adminApi.update('notices', id, payload);
                else await adminApi.create('notices', payload);
                toast.success(id ? 'Notice updated' : 'Notice created');
                navigate('/dashboard/notices');
            } catch (err) {
                const message = errorMessage(err, 'The notice could not be saved.');
                if (err?.response?.status === 409) setFieldError('slug', message);
                setSaveError(message);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (loading) return <AdminPageSkeleton />;

    return (
        <FormPage
            title={id ? 'Edit Notice' : 'Add Notice'}
            subtitle={id ? undefined : 'Drafts stay hidden until you publish them.'}
            backTo="/dashboard/notices"
            backLabel="notices"
        >
            <ErrorBanner message={loadError || saveError} />
            {!loadError && (
                <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormikField formik={formik} name="title" label="Title" required className="md:col-span-2" maxLength={200} />
                        <div className="md:col-span-2"><SlugField formik={formik} base="/notices" /></div>

                        <Field label="Category" htmlFor="category" className="md:col-span-2">
                            <CategorySelect
                                id="category"
                                resource="notice-categories"
                                value={formik.values.category}
                                onChange={(value) => formik.setFieldValue('category', value)}
                            />
                        </Field>

                        <FormikField
                            formik={formik}
                            name="excerpt"
                            label="Short description"
                            as="textarea"
                            rows={3}
                            hint="Shown on the notice board. Leave empty to use the start of the content."
                            className="md:col-span-2"
                            maxLength={500}
                        />

                        <Field label="Full notice" className="md:col-span-2">
                            <Suspense fallback={<Skeleton className="h-72 w-full rounded-lg" />}>
                                <RichTextEditor
                                    value={formik.values.content}
                                    onChange={(html) => formik.setFieldValue('content', html)}
                                    placeholder="Write the full notice here (optional when a PDF is attached)..."
                                />
                            </Suspense>
                        </Field>

                        <Field label="PDF attachment" className="md:col-span-2">
                            <PdfField value={attachment} onChange={setAttachment} />
                        </Field>

                        <PublishFields
                            formik={formik}
                            featuredLabel="Featured notice"
                            featuredHint="Marked as important and listed first on the home page."
                        />
                    </div>

                    <FormActions
                        onCancel={() => navigate('/dashboard/notices')}
                        saving={formik.isSubmitting}
                        saveLabel={id ? 'Update notice' : 'Create notice'}
                    />
                </form>
            )}
        </FormPage>
    );
};

export default NoticeForm;
