import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
    FaBold, FaItalic, FaLink, FaListOl, FaListUl, FaMinus, FaQuoteRight, FaRedo,
    FaStrikethrough, FaUndo, FaUnlink,
} from 'react-icons/fa';

// Rich text editor for news and notice content (TipTap). It produces the same small
// set of tags the server allows: headings, bold/italic/strike, lists, quotes, links, rules.
// This file is loaded on demand by the forms, so the editor is not part of the public site.

const ToolButton = ({ onClick, active, disabled, label, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={label}
        aria-label={label}
        aria-pressed={active}
        className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm transition-colors disabled:opacity-40 ${active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
    >
        {children}
    </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-slate-300" aria-hidden="true" />;

const RichTextEditor = ({ value, onChange, onBlur, invalid = false, placeholder = 'Write the content here...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
            Link.configure({ openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto', 'tel'] }),
        ],
        content: value || '',
        editorProps: {
            attributes: { class: 'rich-text', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Content', 'data-placeholder': placeholder },
        },
        onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
        onBlur: () => onBlur?.(),
    });

    // Content that arrives after the editor was created (editing an existing item).
    useEffect(() => {
        if (editor && value !== undefined && value !== (editor.isEmpty ? '' : editor.getHTML())) {
            editor.commands.setContent(value || '', false);
        }
    }, [editor, value]);

    if (!editor) return <div className="h-72 animate-pulse rounded-lg bg-slate-200" role="status" aria-label="Loading editor" />;

    const setLink = () => {
        const previous = editor.getAttributes('link').href || 'https://';
        const url = window.prompt('Link address (https://...)', previous);
        if (url === null) return;
        const trimmed = url.trim();
        if (!trimmed || trimmed === 'https://') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
        } else {
            window.alert('Links must start with https://, http://, mailto: or tel:');
        }
    };

    const chain = () => editor.chain().focus();
    const isEmpty = editor.isEmpty;

    return (
        <div className={`rich-text-editor overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-blue-500 ${invalid ? 'border-red-500' : 'border-gray-300'}`}>
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5" role="toolbar" aria-label="Text formatting">
                <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}><FaBold /></ToolButton>
                <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}><FaItalic /></ToolButton>
                <ToolButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}><FaStrikethrough /></ToolButton>
                <Divider />
                <ToolButton label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><span className="font-bold">H2</span></ToolButton>
                <ToolButton label="Subheading" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><span className="font-bold">H3</span></ToolButton>
                <Divider />
                <ToolButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}><FaListUl /></ToolButton>
                <ToolButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}><FaListOl /></ToolButton>
                <ToolButton label="Quote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}><FaQuoteRight /></ToolButton>
                <ToolButton label="Horizontal line" onClick={() => chain().setHorizontalRule().run()}><FaMinus /></ToolButton>
                <Divider />
                <ToolButton label="Add or edit link" active={editor.isActive('link')} onClick={setLink}><FaLink /></ToolButton>
                <ToolButton label="Remove link" disabled={!editor.isActive('link')} onClick={() => chain().unsetLink().run()}><FaUnlink /></ToolButton>
                <Divider />
                <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}><FaUndo /></ToolButton>
                <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}><FaRedo /></ToolButton>
            </div>
            <div className="relative">
                {isEmpty && <p className="pointer-events-none absolute left-4 top-4 text-slate-400">{placeholder}</p>}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
