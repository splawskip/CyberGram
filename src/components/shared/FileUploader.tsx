import React from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { FileUploaderProps } from '@/types';

function FileUploader({ fieldChange, mediaUrl } : FileUploaderProps) {
  const [file, setFile] = React.useState<File[]>([]);
  const [fileUrl, setFileUrl] = React.useState<string>(mediaUrl);
  // Handle on drop event.
  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, fieldChange]);
  // Configure dropzone.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.webp'],
    },
  });
  // Build file uploader component.
  return (
    <div {...getRootProps()} className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />
      {
       fileUrl ? (
         <>
           <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
             <img src={fileUrl} alt="Uploaded asset" className="file_uploader-img" />
           </div>
           <p className="file_uploader-label">Click or drag photo to replace</p>
         </>
       ) : (
         <div className="file_uploader-box">
           <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="File Upload" />
           <h3 className="base-medium text-light-2 mb-2 mt-6">Drag photo here</h3>
           <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
           <Button className="shad-button_dark_4">Select from file explorer</Button>
         </div>
       )
      }
    </div>
  );
}

export default FileUploader;
