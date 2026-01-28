import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { marked } from 'marked';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaUndo,
  FaLink,
  FaImage,
  FaSave,
  FaTimes,
  FaTable,
  FaCode,
  FaFileDownload,
  FaFileUpload,
  FaColumns,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";

const lowlight = createLowlight(common);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

const MenuBar = ({ editor, onImageUpload }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) onImageUpload(file);
    };

    input.click();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 sticky top-0 z-10">
      <button 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`} 
        title="Bold"
      >
        <FaBold />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`} 
        title="Italic"
      >
        <FaItalic />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`} 
        title="Underline"
      >
        <FaUnderline />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`} 
        title="Heading"
      >
        <FaHeading />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`} 
        title="Bullet List"
      >
        <FaListUl />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`} 
        title="Ordered List"
      >
        <FaListOl />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`} 
        title="Blockquote"
      >
        <FaQuoteLeft />
      </button>

      <button 
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`} 
        title="Code Block"
      >
        <FaCode />
      </button>

      <button 
        onClick={addTable}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('table') ? 'bg-gray-200' : ''}`} 
        title="Insert Table"
      >
        <FaTable />
      </button>

      <button 
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`} 
        title="Link"
      >
        <FaLink />
      </button>

      <button 
        onClick={addImage} 
        className="p-2 rounded hover:bg-gray-200" 
        title="Upload Image"
      >
        <FaFileUpload />
      </button>

      {editor.isActive('table') && (
        <>
          <button 
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-2 rounded hover:bg-gray-200" 
            title="Add Column"
          >
            <FaColumns />
          </button>
          <button 
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-2 rounded hover:bg-gray-200" 
            title="Add Row"
          >
            <FaPlus />
          </button>
          <button 
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded hover:bg-gray-200" 
            title="Delete Table"
          >
            <FaTrash />
          </button>
        </>
      )}

      <button 
        onClick={() => editor.chain().focus().undo().run()} 
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200" 
        title="Undo"
      >
        <FaUndo />
      </button>

      <button 
        onClick={() => editor.chain().focus().redo().run()} 
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200" 
        title="Redo"
      >
        <FaRedo />
      </button>
    </div>
  );
};

const StoryEditor = () => {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");
  const [story, setStory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
      Placeholder.configure({
        placeholder: "Write your story here...",
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Content is handled through the editor state
    },
  });

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        editor.chain().focus().setImage({ src: data.url }).run();
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };

  const downloadAsMarkdown = () => {
    setDownloading(true);
    try {
      const content = editor.getText();
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${story?.title || 'story'}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Downloaded as Markdown');
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Error downloading file');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (storyId) {
      const API_URL = import.meta.env.VITE_API_URL;
         fetch(`${API_URL}/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => {
        if (!res.ok) {
          console.warn(`Story ${storyId} not found (status ${res.status})`);
          throw new Error("Story not found");
        }
        return res.json();
      })
      .then(data => {
        setStory(data);
        if (editor) {
          const html = marked(data.content);
          editor.commands.setContent(html);
        }
      })
      .catch((err) => {
        console.error("Error fetching story:", err);
        toast.error("Failed to load story");
      });
    }
  }, [storyId, editor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/stories/${storyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: story.title,
          content: editor.getHTML(),
          tags: story.tags,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Story updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving story.");
    } finally {
      setSaving(false);
    }
  };

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Fixed Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#30B349]">

              Professional Story Editor
            </h2>
            <div className="flex gap-2">
              {/* <button
                onClick={downloadAsMarkdown}
                disabled={downloading}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <FaFileDownload className="mr-2" />
                {downloading ? "Downloading..." : "Download"}
              </button> */}
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-2 text-gray-800">{story.title}</h3>
        </div>
      </div>

{/* Add this right below the header or wherever it fits best */}
<div className="p-2 bg-gray-100 text-right">
  <a
    href="https://sojoinsights.nigeriahealthwatch.com/guest"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
  >
    Continue as Guest for More Insights
  </a>
</div>

      {/* Scrollable Editor Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto flex flex-col">
          <div className="border rounded-lg shadow-sm bg-white h-full flex flex-col">
            {editor && <MenuBar editor={editor} onImageUpload={handleImageUpload} />}
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="flex bg-white shadow-lg rounded-lg p-1">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FaBold />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FaItalic />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor.isActive('underline') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <FaUnderline />
                  </button>
                </div>
              </BubbleMenu>
            )}
            <EditorContent
              editor={editor}
              className="flex-1 p-4 focus:outline-none prose max-w-none overflow-y-auto"
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t p-2 sticky bottom-0">
        <div className="max-w-5xl mx-auto text-sm text-gray-500">
          Characters: {editor?.storage.characterCount.characters()} | 
          Words: {editor?.storage.characterCount.words()}
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;