export const extractImageFiles = (originalData, formData) => {
    originalData.images.forEach((imgObj) => {
        if (imgObj && imgObj.file) {
            formData.append("files", imgObj.file);
        }
    });
}