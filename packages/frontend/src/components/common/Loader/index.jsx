import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loader = ({ fullscreen, className }) => {
    return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: '#0F766E' }} spin={true} />} className={className} fullscreen={fullscreen} style={{ backgroundColor: '#f8fafc' }} />
    )
}
export default Loader