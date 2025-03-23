import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface NewsEditorProps {
  content: { type: string; value: string; alt?: string }[];
  onChange: (content: { type: string; value: string; alt?: string }[]) => void;
  slug: string;
}

export const NewsEditor: React.FC<NewsEditorProps> = ({
  content,
  onChange,
  slug,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false, // Отключаем встроенный link
      }),
      Image.configure({
        inline: false,
      }),
    ],
    content: content
      .map((block) => {
        if (block.type === "text") {
          return block.value;
        } else if (block.type === "image") {
          return `<img src="${block.value}" alt="${block.alt || ""}" />`;
        }
        return "";
      })
      .join(""),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const blocks: { type: string; value: string; alt?: string }[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      doc.body.childNodes.forEach((node) => {
        if (node.nodeName === "P") {
          const htmlContent = node.innerHTML.trim();
          if (htmlContent && htmlContent !== "<br>") {
            blocks.push({ type: "text", value: htmlContent });
          }
        } else if (node.nodeName === "IMG") {
          const src = (node as HTMLImageElement).src;
          const alt = (node as HTMLImageElement).alt;
          if (src) {
            blocks.push({ type: "image", value: src, alt: alt || undefined });
          }
        }
      });

      onChange(blocks);
    },
    onCreate: () => {},
  });

  // Функция для загрузки изображения через API
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formDataImages = new FormData();
    formDataImages.append("entityType", "news");
    formDataImages.append("slug", slug);
    Array.from(files).forEach((file) => {
      formDataImages.append("file", file);
    });

    try {
      const response = await fetch(
        `https://api.made.quixoria.ru/image-upload`,
        {
          method: "POST",
          body: formDataImages,
        }
      );
      const result = await response.json();

      if (response.ok) {
        const imageUrl = result.filePaths[0];
        const alt =
          window.prompt("Введите описание изображения (alt):") ||
          "Изображение в новости";
        editor?.chain().focus().setImage({ src: imageUrl, alt }).run();
        toast.success("Изображение успешно загружено");
      } else {
        toast.error(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Произошла ошибка при загрузке изображения");
    } finally {
      setIsUploading(false);
    }
  };

  // Функции для форматирования текста
  const toggleBold = () => {
    if (editor && editor.can().toggleBold()) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const toggleItalic = () => {
    if (editor && editor.can().toggleItalic()) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  // Альтернативный способ добавления ссылок
  const setLink = () => {
    if (!editor) {
      console.error("Редактор не инициализирован");
      toast.error("Редактор не готов");
      return;
    }

    const selection = editor.state.selection;
    if (selection.empty) {
      toast.error("Выделите текст, чтобы добавить ссылку");
      return;
    }

    const url = window.prompt("Введите URL ссылки:");
    if (url) {
      const selectedText = editor.state.doc.textBetween(
        selection.from,
        selection.to
      );
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
      editor
        .chain()
        .focus()
        .deleteRange(selection)
        .insertContent(linkHtml)
        .run();
    }
  };

  // Проверяем, инициализирован ли редактор
  if (!editor) {
    return <div>Загрузка редактора...</div>;
  }

  return (
    <div className="border rounded-md p-4">
      {/* Панель инструментов */}
      <div className="mb-2 flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleBold}
          disabled={!editor.can().toggleBold()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <BoldIcon size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleItalic}
          disabled={!editor.can().toggleItalic()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <ItalicIcon size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={setLink}
          disabled={editor.state.selection.empty}
          className="flex items-center gap-2"
        >
          <LinkIcon size={16} />
        </Button>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <ImageIcon size={16} />
            {isUploading ? "Загрузка..." : "Добавить изображение"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>
      {/* Редактор */}
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none min-h-[200px] border p-2 rounded"
      />
    </div>
  );
};
