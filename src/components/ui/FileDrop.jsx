import { useId, useRef, useState } from "react";
import { IconUpload, IconFile, IconTrash } from "./Icons";
import "./FileDrop.css";

export default function FileDrop({
  label,
  accept = "application/pdf",
  multiple = false,
  files = [],
  onChange,
  renderMeta,
  disabled,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const emit = (list) => {
    const next = [...list].filter((f) => f);
    onChange(multiple ? next : next.slice(0, 1));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    emit(e.dataTransfer.files);
  };

  const removeAt = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="b-drop">
      <label
        htmlFor={inputId}
        className={`b-drop__zone ${dragging ? "is-dragging" : ""} ${disabled ? "is-disabled" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <IconUpload size={24} />
        <span className="b-drop__label">{label}</span>
        <span className="b-drop__cta">اسحب الملف هنا أو اضغط للاختيار</span>
        <input
          ref={inputRef}
          id={inputId}
          className="visually-hidden"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => emit(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className="b-drop__list">
          {files.map((entry, i) => {
            const file = entry.file ?? entry;
            return (
              <li className="b-drop__item" key={`${file.name}-${i}`}>
                <IconFile size={18} />
                <span className="b-drop__name" title={file.name}>{file.name}</span>
                {renderMeta && <span className="b-drop__meta">{renderMeta(entry, i)}</span>}
                <button
                  type="button"
                  className="b-drop__remove"
                  onClick={() => removeAt(i)}
                  aria-label={`إزالة ${file.name}`}
                >
                  <IconTrash size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
