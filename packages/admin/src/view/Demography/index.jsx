import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setActiveHeader } from "../../redux/slices/headerSlice"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Button, Checkbox, message } from "antd"
import { allDemography, updateProfileQuestion } from "../../redux/actions/question"
import { useSelector } from "react-redux"
import { dragIcon } from "../../assets/icons"
import "./style.scss";
import { CustomScroll } from "react-custom-scroll"

const DemoGraphy = () => {
    const { demographyList } = useSelector((state) => state.question)
    const dispatch = useDispatch()
    const [items, setItems] = useState([]);
    const [initialItems, setInitialItems] = useState([]); // To track the original state
    const [disable, setDisable] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dispatch(setActiveHeader({ name: "demo_graphy", heading: "Demography" }))
        dispatch(allDemography())
    }, [])

    useEffect(() => {
        let tempArray = [];
        if (demographyList?.length > 0) {
            demographyList.forEach((profileQuestion) => {
                let subObj = {
                    ...profileQuestion,
                    label: profileQuestion?.short_desc?.[0]?.value,
                    id: profileQuestion?._id
                }
                tempArray.push({ ...subObj })
            })
            setItems([...tempArray])
            setInitialItems([...tempArray]) // Set the initial state
        }
    }, [demographyList])

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, { ...removed, sequence: result.destination.index + 1 });
        setItems(reorderedItems);

        // Check if the items have changed compared to the initial state
        setDisable(JSON.stringify(reorderedItems) === JSON.stringify(initialItems));
    }

    const handleCheckBox = (e, item, i) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map((prevItem, index) => {
                if (index === i) {
                    return { ...prevItem, selected: e.target.checked };
                }
                return prevItem;
            });

            // Check if the items have changed compared to the initial state
            setDisable(JSON.stringify(updatedItems) === JSON.stringify(initialItems));
            return updatedItems;
        });
    };

    // For save changes button
    const onClickSaveChanges = (e) => {
        setLoading(true)
        const payload = items?.map(({ label, ...rest }, i) => {
            return { _id: rest?._id, sequence: i + 1, selected: rest.selected };
        });
        dispatch(updateProfileQuestion(payload)).then((res) => {
            if (res?.payload?.status === true) {
                message.success(res?.payload?.message)
                setInitialItems(items); // Update the initial state on successful save
                setDisable(true); // Disable the button after saving
                setLoading(false)
            } else {
                message.success("Something went wrong!")
                setLoading(false)
            }
        })
    }

    return (
        <div className="demograpy-sec">
            <div className="dashboard-heading">Select which question you want to show on user profile</div>
            <CustomScroll heightRelativeToParent="calc(100vh - 240px)" className="cstm-scroll">
                <div>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="dnd"
                                >
                                    {
                                        items?.map((item, i) => (
                                            <Draggable key={item?.id} draggableId={item?.id} index={i}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="dnd-class">
                                                            <div>
                                                                <span>{dragIcon}</span>
                                                                <Checkbox onChange={(e) => handleCheckBox(e, item, i)} checked={item?.selected} disabled={items.filter(item => item.selected).length >= 5 && !item.selected}>
                                                                    {item?.label}
                                                                </Checkbox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </CustomScroll>

            <div className="dnd_btn">
                <Button onClick={onClickSaveChanges} loading={loading} disabled={disable} type="primary" className="yellow-btn">Save Changes</Button>
            </div>
        </div>
    )
}

export default DemoGraphy;
