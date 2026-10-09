import React, { lazy, Suspense, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/content';
import { AdminPageSkeleton, Skeleton } from '../../components/common/Skeleton';
import { ErrorBanner, FormPage } from '../ui';
import { Field, FormActions, FormikField } from '../content/shared';
import { PublishFields, SlugField } from '../content/PublishPanel';
import { ImageField } from '../content/uploads';
import { CategorySelect, TagInput } from '../content/taxonomy';
import {
    errorMessage, fromDateTimeInput, SLUG_MESSAGE, SLUG_PATTERN, toDateTimeInput, useEditItem,
} from '../content/hooks';

// The editor is the largest part of this form, so it is downloaded only when a form opens.
const RichTextEditor = lazy(() => import('../content/RichTextEditor'));

const textOf = (html) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

const schema = Yup.object({
    title: Yup.string().trim().required('Title is required').max(200, 'Title cannot be longer than 200 characters'),
    slug: Yup.string().matches(SLUG_PATTERN, { message: SLUG_MESSAGE, excludeEmptyString: true }).max(80, 'Slug cannot be longer than 80 characters'),
    excerpt: Yup.string().max(500, 'Excerpt cannot be longer than 500 characters'),
    content: Yup.string().test('not-empty', 'Content is required', (value) => !!textOf(value || '')),
    author: Yup.string().max(100, 'Author cannot be longer than 100 characters'),
    featuredImageAlt: Yup.string().max(300, 'Alt text cannot be longer than 300 characters'),
});

const emptyValues = {
    title: '', slug: '', excerpt: '', content: '', featuredImage: '', featuredImageAlt: '',
    category: '', tags: [], featured: false, status: 'draft', publishedAt: '', author: '',
};

const toValues = (item) => ({
    title: item.title || '',
    slug: item.slug || '',
    excerpt: item.excerpt || '',
    content: item.content || '',
    featuredImage: item.featuredImage || '',
    featuredImageAlt: item.featuredImageAlt || '',
    category: item.category?._id || '',
    tags: (item.tags || []).map((tag) => tag.name),
    featured: !!item.featured,
    status: item.status || 'draft',
    publishedAt: toDateTimeInput(item.publishedAt),
    author: item.author || '',
});

// Create and edit form for news articles (/dashboard/newsform and /dashboard/newsformedit/:id).
const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { item, loading, error: loadError } = useEditItem('news', id);
    const [saveError, setSaveError] = useState(null);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: item ? toValues(item) : emptyValues,
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSaveError(null);
            const payload = { ...values, title: values.title.trim(), publishedAt: fromDateTimeInput(values.publishedAt) };
            try {
                if (id) await adminApi.update('news', id, payload);
                else await adminApi.create('news', payload);
                toast.success(id ? 'News article updated' : 'News article created');
                navigate('/dashboard/news');
            } catch (err) {
                const message = errorMessage(err, 'The article could not be saved.');
                // A taken slug is shown next to the slug field.
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
            title={id ? 'Edit News Article' : 'Add News Article'}
            subtitle={id ? undefined : 'Drafts stay hidden until you publish them.'}
            backTo="/dashboard/news"
            backLabel="news"
        >
            <ErrorBanner message={loadError || saveError} />
            {!loadError && (
                <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormikField formik={formik} name="title" label="Title" required className="md:col-span-2" maxLength={200} />
                        <div className="md:col-span-2"><SlugField formik={formik} base="/news" /></div>

                        <Field label="Category" htmlFor="category">
                            <CategorySelect
                                id="category"
                                resource="news-categories"
                                value={formik.values.category}
                                onChange={(value) => formik.setFieldValue('category', value)}
                            />
                        </Field>
                        <FormikField formik={formik} name="author" label="Author" hint="Leave empty to use your name." maxLength={100} />

                        <Field label="Tags" htmlFor="tags" className="md:col-span-2">
                            <TagInput id="tags" value={formik.values.tags} onChange={(tags) => formik.setFieldValue('tags', tags)} />
                        </Field>

                        <Field label="Featured image" className="md:col-span-2">
                            <ImageField
                                value={formik.values.featuredImage}
                                onChange={(path, media) => {
                                    formik.setFieldValue('featuredImage', path);
                                    if (media?.alt && !formik.values.featuredImageAlt) formik.setFieldValue('featuredImageAlt', media.alt);
                                }}
                            />
                        </Field>
                        <FormikField
                            formik={formik}
                            name="featuredImageAlt"
                            label="Image alt text"
                            hint="Describes the image for screen readers and search engines."
                            className="md:col-span-2"
                            maxLength={300}
                        />

                        <FormikField
                            formik={formik}
                            name="excerpt"
                            label="Excerpt"
                            as="textarea"
                            rows={3}
                            hint="Short summary shown on cards and in search results. Leave empty to use the start of the article."
                            className="md:col-span-2"
                            maxLength={500}
                        />

                        <Field
                            label="Content"
                            required
                            className="md:col-span-2"
                            error={formik.touched.content && formik.errors.content}
                        >
                            <Suspense fallback={<Skeleton className="h-72 w-full rounded-lg" />}>
                                <RichTextEditor
                                    value={formik.values.content}
                                    onChange={(html) => formik.setFieldValue('content', html)}
                                    onBlur={() => formik.setFieldTouched('content', true)}
                                    invalid={!!(formik.touched.content && formik.errors.content)}
                                />
                            </Suspense>
                        </Field>

                        <PublishFields
                            formik={formik}
                            featuredLabel="Featured article"
                            featuredHint="Highlighted at the top of the News page and shown first on the home page."
                        />
                    </div>

                    <FormActions
                        onCancel={() => navigate('/dashboard/news')}
                        saving={formik.isSubmitting}
                        saveLabel={id ? 'Update article' : 'Create article'}
                    />
                </form>
            )}
        </FormPage>
    );
};

export default NewsForm;
