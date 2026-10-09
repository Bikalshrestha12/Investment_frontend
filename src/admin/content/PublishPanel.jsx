import React from 'react';
import { FiLink } from 'react-icons/fi';
import { Field, FormikField, Toggle } from './shared';
import { slugify } from './hooks';

// Fields every content form shares: slug, status, publication date and "featured".

/**
 * Slug input with the public address shown underneath. Until the admin types in it,
 * the slug follows the title; "Generate from title" resets it.
 *   base  '/news' | '/notices' | '/gallery'
 */
export const SlugField = ({ formik, base }) => {
    const { slug, title } = formik.values;
    const error = formik.touched.slug && formik.errors.slug;
    return (
        <Field
            label="Slug (page address)"
            htmlFor="slug"
            error={error}
            hint={`${window.location.origin}${base}/${slug || slugify(title) || '…'}`}
        >
            <div className="flex gap-2">
                <input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => formik.setFieldValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    onBlur={formik.handleBlur}
                    placeholder={slugify(title) || 'generated-from-the-title'}
                    aria-invalid={!!error}
                    className={`w-full rounded-lg border px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                    type="button"
                    onClick={() => formik.setFieldValue('slug', slugify(title))}
                    title="Generate from title"
                    aria-label="Generate slug from title"
                    className="shrink-0 rounded-lg border border-slate-300 px-3 text-slate-600 hover:bg-slate-50"
                >
                    <FiLink />
                </button>
            </div>
        </Field>
    );
};

/**
 * Status + publication date (+ optional featured toggle).
 * A published item dated in the future is scheduled: it appears on the site at that time.
 */
export const PublishFields = ({ formik, dateLabel = 'Publication date', featuredLabel, featuredHint }) => {
    const { status, publishedAt } = formik.values;
    const scheduled = status === 'published' && publishedAt && new Date(publishedAt) > new Date();
    return (
        <>
            <FormikField formik={formik} name="status" label="Status" as="select">
                <option value="draft">Draft (hidden from the site)</option>
                <option value="published">Published</option>
            </FormikField>
            <FormikField
                formik={formik}
                name="publishedAt"
                label={dateLabel}
                type="datetime-local"
                hint={scheduled
                    ? 'Scheduled: this will appear on the site at the chosen date and time.'
                    : 'Leave empty to use the moment it is published. A future date schedules it.'}
            />
            {featuredLabel && (
                <div className="md:col-span-2">
                    <Toggle
                        id="featured"
                        checked={formik.values.featured}
                        onChange={(checked) => formik.setFieldValue('featured', checked)}
                        label={featuredLabel}
                        description={featuredHint}
                    />
                </div>
            )}
        </>
    );
};
