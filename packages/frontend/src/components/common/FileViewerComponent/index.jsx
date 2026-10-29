import { Image } from 'antd';
import { downloadIcon, imageDeleteIcon } from '../../../assets/icons';
import pdf from '../../../assets/images/pdf.svg';

const renderIconSection = (urlItem, handleClickModal, urls) => (
    <div className='download-delete'>
        <span> <a href={urlItem} target='_blank'>{downloadIcon}</a></span>
        {urls.length > 1 && <span onClick={() => handleClickModal("deleteSingleAttachment", true, urlItem)}>{imageDeleteIcon}</span>}
    </div>
);

const renderMedia = (type, url, index, isMap) => {
    const commonProps = { key: `${type}-${index}`, src: url, alt: "" };
    switch (type) {
        case 'image':
            return isMap ? <Image {...commonProps} style={{ borderRadius: "3px" }} /> : <img {...commonProps} />;
        case 'video':
            return <video {...commonProps} controls={isMap ? true : false} muted autoPlay={false} width="90px" height="50px" />;
        case 'pdf':
            return <img {...commonProps} src={pdf} width="500px" height="50px" alt="PDF Icon" />;
        case 'audio':
            return <audio controls><source src={url} width="90px" height="50px" /></audio>;
        default:
            return <span key={`other-${index}`}>-</span>;
    }
};

export const getFileType = (urls, isMap, renderIcon, modalAction, handleClickModal) => {
    if (!Array.isArray(urls)) urls = [urls]; // Ensure urls is always an array

    const processUrl = (urlItem, index) => {
        const extension = urlItem?.split('.').pop().toLowerCase();
        const type = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(extension) ? 'image' :
            ['mp4', 'webm', 'avi', 'mov'].includes(extension) ? 'video' :
                extension === 'pdf' ? 'pdf' :
                    ['mp3', 'wav', 'ogg'].includes(extension) ? 'audio' : 'other';

        return (
            <div key={index} className='attachment-modal-img'>
                {renderIcon && renderIconSection(urlItem, handleClickModal, urls)}
                {renderMedia(type, urlItem, index, isMap)}
            </div>
        );

    };

    if (isMap) {
        return urls.map(processUrl);
    } else {
        // Display only the first item and a count of the remaining items if any
        return (
            <>
                {processUrl(urls[0], 0)}
                {urls.length > 1 && <span key="count">{`${urls.length > 9 ? "+9" : `+${urls.length - 1}`}`}</span>}
            </>
        );
    }
};

const FileViewerComponent = ({ view, url, i, isMap, renderIcon }) => {

    return (
        <div key={i}>
            <div className={view}>
                {getFileType(url, isMap, renderIcon,)}
            </div>
        </div>
    );

};

export default FileViewerComponent;