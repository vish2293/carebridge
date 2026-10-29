import { Button, Checkbox, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteIcon, dragIcon, editIcon, pluseIcon } from "../../assets/icons";
import AddAndEditQuestionModal from "../../components/modal/AddQuestionModal";
import DeleteModal from "../../components/modal/DeleteModal";
import { allProfileQuestion, createProfileQuestion, deleteQuestion, getProfileCategory, searchQuestion, updateClientQuestions, updateProfileQuestion, updateQuestion } from "../../redux/actions/question";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import QuestionnaireTable from "./QuestionnaireTable";
import "./style.scss";
import Loader from "../../components/common/Loader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CustomScroll } from "react-custom-scroll";

const Questionnaire = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const { questionCategoryList } = useSelector((state) => state.questionCategory);
  const { profileQuestionList, profileQuestionLoading } = useSelector((state) => state.question);
  const dispatch = useDispatch();
  const [questionLists, setQuestionLists] = useState([]);
  const [openDeleteQuestionModal, setOpenDeleteQuestionModal] = useState(false);
  const [isMapObjective, setIsMapObjective] = useState(false);
  const [modalAction, setModalAction] = useState("default");
  const [answerType, setAnswerType] = useState("");
  const [iscategory, setIsCategory] = useState(false);
  const [items, setItems] = useState([]);
  const [disable, setDisable] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: '',
    category: '',
    questionEnglish: '',
    questionSpanish: '',
    answer_type: '',
    answersML: [],
    isMapped: false,
  });

  useEffect(() => {
    dispatch(allProfileQuestion());
    dispatch(setActiveHeader({ name: "questionnaire", heading: "Client Intake" }));
  }, [dispatch]);

  useEffect(() => {
    setQuestionLists(profileQuestionList || []);
  }, [profileQuestionList]);

  const handleAnswerType = (e) => {
    setIsMapObjective(e.target.value === "radio");
    setAnswerType(e.target.value);
  };

  const modalClose = () => {
    setInitialValues({
      id: '',
      category: '',
      questionEnglish: '',
      questionSpanish: '',
      answer_type: '',
      answersML: [],
      isMapped: false,
    });
    setAnswerType("");
    setBtnLoading(false);
    setIsMapObjective(false);
    setIsCategory(false);
    setModalAction("default");
  };

  useEffect(() => {
    let tempArray = [];
    if (questionLists?.length > 0) {
      questionLists.forEach((profileQuestion) => {
        const question = profileQuestion?.questionML?.map((ques) => ques?.value)?.join("/")
        let subObj = {
          ...profileQuestion,
          label: question,
          id: profileQuestion?._id,
        };
        tempArray.push({ ...subObj });
      });
      // const sortedItems = tempArray?.sort((a, b) => a?.sequence - b?.sequence);
      setItems([...tempArray]);
    }
  }, [questionLists]);

  const createQuestionObject = (inputObject) => {
    const { category, questionEnglish, questionSpanish, shortEng, shortSpan, answer_type, answersML } = inputObject;

    const questionML = [
      { key: "en", value: questionEnglish || "" },
      { key: "es", value: questionSpanish || "" },
    ];
    const short_desc = [{ key: "en", value: shortEng }, { key: 'es', value: shortSpan }];

    const answers = {
      answer_type,
      answersML: answersML?.length > 0 ? answersML.map(answer => ({
        key: answer.objective || "",
        values: {
          en: answer.engOptions || "",
          es: answer.spanishOptions || "",
        },
      })) : "",
    };

    return {
      category: category || "",
      questionML,
      answers,
      short_desc,
      isMapped: inputObject?.isMapped,
    };
  };

  const resetForm = () => {
    setInitialValues({
      id: "",
      category: '',
      questionEnglish: '',
      questionSpanish: '',
      answer_type: '',
      answersML: [],
      isMapped: false,
    });
  };

  const handleMapObjective = (value) => {
    setIsMapObjective(value);
  };

  const handleCategoryChange = (value) => {
    if (value) {
      setIsCategory(true);
      setAnswerType('radio');
      setIsMapObjective(true);
    }
  };

  const handleModalClickAction = (action, isOpen, data) => {
    resetForm();
    switch (action) {
      case "addQuestion":
        setModalAction(action);
        dispatch(getProfileCategory());
        break;
      case "editQuestion":
        setIsMapObjective(data?.isMapped);
        setIsCategory(data?.category ? true : false);
        setInitialValues({
          id: data?._id,
          category: data?.category,
          questionEnglish: data?.questionML[0]?.value,
          questionSpanish: data?.questionML[1]?.value,
          shortEng: data?.short_desc[0]?.value,
          shortSpan: data?.short_desc[1]?.value,
          answer_type: data?.answers?.answer_type,
          isMapped: data?.isMapped,
          answersML: data?.answers?.answersML ? data?.answers?.answersML?.map((answerItems) => ({
            engOptions: answerItems?.values?.en, spanishOptions
              :
              answerItems?.values?.es, objective: answerItems?.key
          })
          ) : [],
        });
        setModalAction(action);
        setAnswerType(data?.
          answers?.answer_type);
        break;
      case "deleteQuestion":
        setModalAction(action);
        setInitialValues({ id: data?._id });
        setOpenDeleteQuestionModal(isOpen);
        break;
      default:
        break;
    }
  };

  const handleDispatchAction = (action, data) => {
    switch (action) {
      case "addQuestion":
        data?.validateFields().then((values) => {
          const profileQuestionPayload = createQuestionObject(values);
          setBtnLoading(true);
          dispatch(createProfileQuestion(profileQuestionPayload)).then((res) => {
            if (res?.payload?.status === true) {
              setQuestionLists([...res?.payload?.data]);
              message.success("Question created successfully!");
              data?.resetFields();
              modalClose();
            }
          });
        });
        break;
      case "editQuestion":
        data?.validateFields().then((values) => {
          const editQuestionPayload = {
            id: initialValues?.id,
            questionData: createQuestionObject(values),
          };
          setBtnLoading(true);
          dispatch(updateQuestion(editQuestionPayload)).then((res) => {
            if (res?.payload?.status === true) {
              setQuestionLists(currentQuestions => currentQuestions.map(question => question._id === res.payload.data._id ? res.payload.data : question));
              message.success("Question updated successfully!");
              modalClose();
            }
          });
        });
        break;
      case "deleteQuestion":
        dispatch(deleteQuestion(initialValues.id)).then((res) => {
          if (res?.payload?.status === true) {
            setQuestionLists(question => question?.filter((questionItems) => questionItems?._id !== res?.payload?.data?._id));
            message.success("Question deleted successfully!");
            setOpenDeleteQuestionModal(false);
          } else {
            message.error("Something went wrong!");
          }
        });
        break;
      default:
        break;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
    setDisable(false)
  };

  const onClickSaveChanges = () => {
    const payload = items?.map(({ label, ...rest }, i) => ({ _id: rest?._id, questionNumber: i + 1 }))
    dispatch(updateClientQuestions(payload)).then((res) => {
      if (res?.payload?.status === true) {
        message.success(res?.payload?.message);
        setDisable(true);
      } else {
        message.error("Something went wrong!")
      }
    })
  }

  return profileQuestionLoading ? <Loader className={'page-loader'} /> : (
    <div className='questionnaire_wrapper'>
      <div className='status-sec'>
        <div className='status-sec-left'>
          <div className='dashboard-heading'>Client Intake Questions</div>
        </div>
        <div className='status-sec-right'>
          <div className='request-btn'>
            {loggedInUser?.role !== "Client" && (
              <Button type="primary" className="yellow-btn" icon={pluseIcon} onClick={() => handleModalClickAction("addQuestion", true)}>
                ADD New
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='questionnaire_footer'>
        <div className="demograpy-sec">
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
                                    <span style={{ fontSize: '14px' , lineHeight: '140%' }}>{i + 1}. </span>
                                    {/* <div style={{fontSize:'16px',maxWidth:"100%"}}> */}
                                    <Tooltip title={item?.label} >
                                      <span style={{ fontSize: '14px' , lineHeight: '140%' }}>  {item?.label?.length > 110 ? `${item?.label?.slice(0, 140)}...` : item?.label}</span>
                                    </Tooltip>
                                  </div>
                                  {/* </div> */}
                                  <div className="accept-reject">
                                    <Tooltip title="Edit"><span className="view" onClick={() => handleModalClickAction("editQuestion", true, item)}>{editIcon}</span></Tooltip>
                                    <Tooltip title="Delete"><span className="reject" onClick={() => handleModalClickAction("deleteQuestion", true, item)}>{deleteIcon}</span></Tooltip>
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
            <Button onClick={onClickSaveChanges} disabled={disable} type="primary" className="yellow-btn">Save Changes</Button>
          </div>
        </div>
      </div>
      <AddAndEditQuestionModal
        isOpen={modalAction === "addQuestion" || modalAction === "editQuestion"}
        onClose={modalClose}
        questionCategoryList={questionCategoryList}
        handleAnswerType={handleAnswerType}
        modalAction={modalAction}
        btnLoading={btnLoading}
        iscategory={iscategory}
        isMapObjective={isMapObjective}
        handleCategoryChange={handleCategoryChange}
        handleMapObjective={handleMapObjective}
        answerType={answerType}
        initialValues={initialValues}
        handleDispatchAction={handleDispatchAction}
      />
      <DeleteModal
        isOpen={openDeleteQuestionModal}
        setIsOpen={setOpenDeleteQuestionModal}
        modalAction={modalAction}
        handleDispatchAction={handleDispatchAction}
        title={"Are you sure you want to delete this question?"}
        description={"This question and its details will be deleted permanently!"}
      />
    </div>
  );
};

export default Questionnaire;
