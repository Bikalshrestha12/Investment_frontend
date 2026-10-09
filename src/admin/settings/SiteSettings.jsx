import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { adminApi, fetchSettings } from '../../api/content';
import { AdminPageSkeleton } from '../../components/common/Skeleton';
import { Card, ErrorBanner } from '../ui';
import { Button, Field, FormikField } from '../content/shared';
import { ImageField } from '../content/uploads';
import { errorMessage } from '../content/hooks';

const link = Yup.string().matches(/^https?:\/\/\S+$/i, { message: 'Must start with http:// or https://', excludeEmptyString: true }).max(300);

const schema = Yup.object({
    siteName: Yup.string().max(100, 'Up to 100 characters'),
    siteDescription: Yup.string().max(300, 'Up to 300 characters'),
    siteUrl: link,
    contactEmail: Yup.string().email('Enter a valid email address').max(150),
    contactPhone: Yup.string().max(50, 'Up to 50 characters'),
    address: Yup.string().max(300, 'Up to 300 characters'),
    facebook: link,
    twitter: link,
    instagram: link,
    linkedin: link,
});

const emptyValues = {
    siteName: '', siteDescription: '', siteUrl: '', defaultShareImage: '',
    contactEmail: '', contactPhone: '', address: '',
    facebook: '', twitter: '', instagram: '', linkedin: '',
};

const Section = ({ title, description, children }) => (
    <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
    </Card>
);

// Site-wide settings: search/share details, contact details and social links.
const SiteSettings = () => {
    const [initial, setInitial] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchSettings()
            .then((res) => { if (!cancelled) setInitial({ ...emptyValues, ...res.data }); })
            .catch((err) => { if (!cancelled) setLoadError(errorMessage(err, 'Could not load the settings.')); });
        return () => { cancelled = true; };
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initial || emptyValues,
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            setSaveError(null);
            try {
                // Only the editable fields are sent (the API also returns updatedAt).
                const payload = Object.fromEntries(Object.keys(emptyValues).map((key) => [key, values[key] ?? '']));
                const saved = await adminApi.saveSettings(payload);
                setInitial({ ...emptyValues, ...saved });
                toast.success('Settings saved. Reload the site to see them everywhere.');
            } catch (err) {
                setSaveError(errorMessage(err, 'The settings could not be saved.'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!initial && !loadError) return <AdminPageSkeleton />;

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
            <p className="mt-1 text-sm text-slate-500">Details used in search results, link previews and the site footer.</p>
            <div className="mt-6"><ErrorBanner message={loadError || saveError} /></div>

            {!loadError && (
                <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                    <Section title="Search and sharing" description="Shown in browser tabs, search engines and when a page is shared.">
                        <FormikField formik={formik} name="siteName" label="Site name" hint="Added after every page title." maxLength={100} />
                        <FormikField formik={formik} name="siteUrl" label="Site address" placeholder="https://www.example.com" hint="Used for canonical links. Leave empty to use the current address." />
                        <FormikField formik={formik} name="siteDescription" label="Default description" as="textarea" rows={3} className="md:col-span-2" maxLength={300} hint="Used on pages that have no description of their own." />
                        <Field label="Default share image" className="md:col-span-2">
                            <div className="max-w-sm">
                                <ImageField
                                    value={formik.values.defaultShareImage}
                                    onChange={(path) => formik.setFieldValue('defaultShareImage', path)}
                                />
                            </div>
                        </Field>
                    </Section>

                    <Section title="Contact details" description="Shown in the footer. Empty fields keep the current footer text.">
                        <FormikField formik={formik} name="contactEmail" label="Email" type="email" />
                        <FormikField formik={formik} name="contactPhone" label="Phone" />
                        <FormikField formik={formik} name="address" label="Address" className="md:col-span-2" />
                    </Section>

                    <Section title="Social links" description="Full links to your profiles. Empty links stay inactive in the footer.">
                        <FormikField formik={formik} name="facebook" label="Facebook" placeholder="https://facebook.com/..." />
                        <FormikField formik={formik} name="twitter" label="X (Twitter)" placeholder="https://x.com/..." />
                        <FormikField formik={formik} name="instagram" label="Instagram" placeholder="https://instagram.com/..." />
                        <FormikField formik={formik} name="linkedin" label="LinkedIn" placeholder="https://linkedin.com/company/..." />
                    </Section>

                    <div className="flex justify-end">
                        <Button type="submit" busy={formik.isSubmitting}>{formik.isSubmitting ? 'Saving…' : 'Save settings'}</Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SiteSettings;
