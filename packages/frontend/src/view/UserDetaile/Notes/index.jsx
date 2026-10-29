import DataNotfound from "../../../components/common/DataNotFound";
import AddNote from "./AddNote";
import { Button } from "antd";
import NoteCard from "./NoteCard";
import { useState } from "react";
import SingleNoteForm from "./SingleNoteForm";
import './style.scss'
const Notes = ({ modalAction, handleDispatchAction,btnLoading, noteFormFields, editNoteId, setEditNoteId, setNoteFormFields, noteLists, handleClickModal }) => {
    // const [editNote, setEdit] = useState(null);

    return (
        <div>
            {
                noteLists?.length || modalAction === "addNote" ?
                    <>
                        {
                            noteFormFields?.length > 0 &&
                            <div className="add-note-form">
                                <AddNote handleDispatchAction={handleDispatchAction} noteFormFields={noteFormFields} setNoteFormFields={setNoteFormFields} btnLoading={btnLoading}/>
                            </div>
                        }
                        {
                            noteLists?.map((item, i) => {
                                return (
                                    <div className="notes" key={i}>
                                        {editNoteId === item?._id ?
                                            <SingleNoteForm setEditNoteId={setEditNoteId} item={item} handleDispatchAction={handleDispatchAction} modalAction={modalAction} handleClickModal={handleClickModal} btnLoading={btnLoading}/>
                                            :
                                            <NoteCard item={item} index={i} handleClickModal={handleClickModal} setEditNoteId={setEditNoteId} />}
                                    </div>
                                )
                            })
                        }


                    </>
                    :
                    <DataNotfound />
            }

        </div>
    )
}
export default Notes