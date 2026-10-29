import AddVisitForm from "./AddVisitForm";

const AddVisists = ({
  modalClose,
  timeOptionValue,
  requestStatus,
  handleRequestchange,
  setAddEditvisitLoading,
  setTimeOptionValue,
  handleDispatchAction,
  modalAction,
  createVisitLoading,
  visitInitialValues,
}) => {
  return (
    <div className="addivisit">
      <div className="date">
        <div>Visit detail</div>
        <div>{`${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()}`}</div>
      </div>
      <AddVisitForm
        modalClose={modalClose}
        setAddEditvisitLoading={setAddEditvisitLoading}
        timeOptionValue={timeOptionValue}
        requestStatus={requestStatus}
        setTimeOptionValue={setTimeOptionValue}
        handleRequestchange={handleRequestchange}
        handleDispatchAction={handleDispatchAction}
        createVisitLoading={createVisitLoading}
        modalAction={modalAction}
        visitInitialValues={visitInitialValues}
      />
    </div>
  );
};
export default AddVisists;
