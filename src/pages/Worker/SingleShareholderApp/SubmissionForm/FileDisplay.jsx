import React, { useEffect, useState } from "react";
import done from "../../../../assets/images/done.jpg";
import AttachFileIcon from '@mui/icons-material/AttachFile';

function FileDisplay({ item }) {
	const [url, setUrl] = useState(false);
    const [isImage, setIsImage] = useState(false);

	useEffect(() => {
		const getFileThumb = async () => {
			if (item == 200) {
				setUrl(done);
			} else {
				setUrl(`${process.env.REACT_APP_STORAGE_PATH}${item}`);
			}
		};

		getFileThumb();

        const fileExtension = item.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        setIsImage(imageExtensions.includes(fileExtension));
	}, []);

	return (
        isImage ? (
            url && (
                <img
                    src={url}
                    alt={url}
                    className="thumbnail object-cover object-center absolute top-0 left-0"
                />
            )
		) : (
            <div className="bg-slate-200 absolute inset-0 flex items-center justify-center">
            <AttachFileIcon style={{ fontSize: 48, color: '#555555' }} />
            </div>
        )
	);
}

export default FileDisplay;
