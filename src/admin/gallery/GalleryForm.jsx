import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/content';
import { AdminPageSkeleton } from '../../components/common/Skeleton';
import { ErrorBanner, FormPage } from '../ui';
import { Field, FormActions, FormikField } from '../content/shared';
import { PublishFields, SlugField } from '../content/PublishPanel';
import { ImageField } from '../content/uploads';
import {
    errorMessage, fromDateTimeInput, SLUG_MESSAGE, SLUG_PATTERN, toDateTimeInput, useEditItem,
} from '../content/hooks';
import PhotoManager from './PhotoManager';

const schema = Yup.object({
    title: Yup.string().trim().required('Title is required').max(150, 'Title cannot be longer than 150 characters'),
    slug: Yup.string().matches(SLUG_PATTERN, { message: SLUG_MESSAGE, excludeEmptyString: true }).max(80, 'Slug cannot be longer than 80 characters'),
    description: Yup.string().max(2000, 'Description cannot be longer than 2000 characters'),
});

const emptyValues = { title: '', slug: '', description: '', coverImage: '', status: 'draft', publishedAt: '' };

const toValues = (item) => ({
    title: item.title || '',
    slug: item.slug || '',
    description: item.description || '',
    coverImage: item.coverImage || '',
    status: item.status || 'draft',
    publishedAt: toDateTimeInput(item.publishedAt),
});

// Create and edit form for gallery albums (/dashboard/galleryform and /dashboard/galleryformedit/:id).
// Photos are managed below the form once the album exists.
const GalleryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { item, loading, error: loadError } = useEditItem('gallery', id);
    const [saveError, setSaveError] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => { setImages(item?.images || []); }, [item]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: item ? toValues(item) : emptyValues,
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSaveError(null);
            const payload = { ...values, title: values.title.trim(), publishedAt: fromDateTimeInput(values.publishedAt) };
            try {
                if (id) {
                    await adminApi.update('gallery', id, payload);
                    toast.success('Album updated');
                    navigate('/dashboard/gallery');
                } else {
                    const created = await adminApi.create('gallery', payload);
                    toast.success('Album created. Now add its photos.');
                    navigate(`/dashboard/galleryformedit/${created._id}`, { replace: true });
                }
            } catch (err) {
                const message = errorMessage(err, 'The album could not be saved.');
                if (err?.response?.status === 409) setFieldError('slug', message);
                setSaveError(message);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    // "Use as cover" on a photo saves straight away, like every other photo action.
    const changeCover = async (path, { silent = false } = {}) => {
        const previous = formik.values.coverImage;
        formik.setFieldValue('coverImage', path);
        if (silent) return;
        try {
            await adminApi.update('gallery', id, { coverImage: path });
            toast.success('Album cover updated');
        } catch (err) {
            formik.setFieldValue('coverImage', previous);
            toast.error(errorMessage(err, 'The cover could not be updated.'));
        }
    };

    if (loading) return <AdminPageSkeleton />;

    return (
        <>
            <FormPage
                title={id ? 'Edit Album' : 'Add Album'}
                subtitle={id ? undefined : 'Create the album first, then add its photos.'}
                backTo="/dashboard/gallery"
                backLabel="gallery"
            >
                <ErrorBanner message={loadError || saveError} />
                {!loadError && (
                    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormikField formik={formik} name="title" label="Album title" required className="md:col-span-2" maxLength={150} />
                            <div className="md:col-span-2"><SlugField formik={formik} base="/gallery" /></div>
                            <FormikField
                                formik={formik}
                                name="description"
                                label="Description"
                                as="textarea"
                                rows={3}
                                className="md:col-span-2"
                                maxLength={2000}
                            />
                            <Field label="Cover image" className="md:col-span-2">
                                <div className="max-w-sm">
                                    <ImageField
                                        value={formik.values.coverImage}
                                        onChange={(path) => formik.setFieldValue('coverImage', path)}
                                        useThumb
                                        aspect="aspect-[4/3]"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">Without a cover, the first photo of the album is used.</p>
                            </Field>
                            <PublishFields formik={formik} dateLabel="Album date" />
                        </div>

                        <FormActions
                            onCancel={() => navigate('/dashboard/gallery')}
                            saving={formik.isSubmitting}
                            saveLabel={id ? 'Update album' : 'Create album'}
                        />
                    </form>
                )}
            </FormPage>

            {id && !loadError && (
                <div className="mx-auto max-w-4xl">
                    <PhotoManager
                        albumId={id}
                        images={images}
                        setImages={setImages}
                        coverImage={formik.values.coverImage}
                        onCoverChange={changeCover}
                    />
                </div>
            )}
        </>
    );
};

export default GalleryForm;
