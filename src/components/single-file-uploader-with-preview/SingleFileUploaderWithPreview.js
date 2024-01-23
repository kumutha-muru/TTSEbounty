import React from "react";
import SingleFileUploader from "../single-file-uploader/SingleFileUploader";

const SingleFileUploaderWithPreview = (props) => {
  const {
    onEdit,
    headerLabel,
    labelText,
    hintText,
    deleteImage,
    file,
    onChange,
    width,
    filePreviewFor,
  } = props;

  return (
    <SingleFileUploader
            onEdit={onEdit}
            headerLabel={headerLabel}
            labelText={labelText}
            hintText={hintText}
            deleteImage={deleteImage}
            file={file}
            onChange={onChange}
            width={width}
            filePreviewFor={filePreviewFor}
          />
  );
};



export default SingleFileUploaderWithPreview;
