import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const f = acceptedFiles[0] ?? null;
            setFile(f);
            onFileSelect?.(f);
        },
        [onFileSelect]
    );

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();         // don't trigger dropzone click
        setFile(null);
        onFileSelect?.(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 20 * 1024 * 1024,   // 20 MB
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`max-w-md mx-auto border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <div className="flex flex-col items-center gap-2">
                        {/* keep your path exactly */}
                        <img src="/icons/info.svg" alt="upload" className="w-12 h-12" />
                        <p className="text-gray-600 text-sm">
              <span className="font-semibold">
                {isDragActive ? "Drop the file here" : "Click to upload"}
              </span>{" "}
                            or drag & drop
                        </p>
                        <p className="text-xs text-gray-400">PDF (max 20 MB)</p>
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-between gap-3 bg-white rounded-lg shadow p-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            {/* keep your paths exactly */}
                            <img src="/images/pdf.png" alt="pdf" className="w-10 h-10 object-contain" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Remove file"
                        >
                            {/* keep your path exactly */}
                            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
