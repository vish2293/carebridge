import { Button, Modal, Table } from "antd";
import { useState } from "react";
import '../style.css';
import summary from '../../../assets/images/summary-data.svg'
import GreenTick from '../../../assets/images/green-tick.svg'
import YellowTick from '../../../assets/images/yellow-tick.svg'
import RedCross from '../../../assets/images/red-cross.svg'


const ImportMessage = ({ isOpen, setIsOpen, resData }) => {
    const handleCancel = () => {
        setIsOpen(false);
    };

    const [showViewLog, setShowViewLog] = useState(false);

    const data = resData?.missingFieldsDetails?.map((field) => {
        const value = {
            lineNo: field.lineNo,
            missingFields: field.missingFields.map(data => data.field).join(', ')
        };
        return value;
    });

    const columns = [
        {
            title: 'Line No.',
            dataIndex: 'lineNo',
            key: 'lineNo',
            width: '100px',
        },
        {
            title: 'Missing Fields',
            dataIndex: 'missingFields',
            key: 'missingFields',
            width: '399px',
        },
    ];

    return (

        <>
            <Modal
                visible={isOpen} // Changed from open to visible
                onCancel={handleCancel}
                className="confirm-modal importCSV-modal"
                centered={true}
                footer={[
                    <div>
                        <Button type="primary" style={{
                            justifyContent: 'center'
                        }} className="asd" onClick={handleCancel}>
                            Done
                        </Button>
                    </div>
                ]}

            >
                <div className="confirm-modal-content importe-data-summary">
                    <span className="icon animate">
                        <img
                            src={summary}
                            alt="check-in"
                        />
                    </span>
                    <h4>Imported Data Summary</h4>
                    {/* <div>
                        <div>Total {resData?.successfullyImportedCount} client data has been successfully imported.</div>
                    </div> */}
                    <div className="note">
                        <span className="icon-img">
                            <img src={GreenTick} />
                        </span>
                        <p>
                            Total {resData?.successfullyImportedCount} client data has been successfully imported.
                        </p>
                    </div>
                    {/* <div>
                        <div>{resData?.duplicateEmailCount} client found duplicate and we have merged them.</div>
                    </div> */}
                    <div className="note">
                        <span className="icon-img">
                            <img src={YellowTick} />
                        </span>
                        <p>
                            {resData?.duplicateEmailCount} client found duplicate and we have merged them.
                        </p>
                    </div>
                    <div className="note">
                        <span className="icon-img">
                            <img src={RedCross} />
                        </span>
                        <p>
                            {resData?.missingFieldsCount} clients are failed to import due to missing field.{' '}
                            <span onClick={() => setShowViewLog(true)}>
                                {' '}
                                <u>
                                    <a>view log</a>
                                </u>
                            </span>
                        </p>
                    </div>
                </div>
            </Modal>
            <Modal
                open={showViewLog}
                footer={null}
                centered={true}
                onCancel={() => setShowViewLog(false)}
            >
                <div className="confirm-modal-content importe-data-summary">
                    <h4>Failed upload log</h4>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />

                </div>
            </Modal>
        </>

    );
};

export default ImportMessage;
