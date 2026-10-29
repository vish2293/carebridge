import { Button, Select, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pluseIcon } from "../../assets/icons";
import Search from "../../components/common/Search";
import AddEditResource from "../../components/modal/AddEditResource";
import DeleteModal from "../../components/modal/DeleteModal";
import {
  createResource,
  createResourceCategory,
  getAllResource,
  getResourceCategoryList,
  getResourceCategoryOption,
  updateAndDeleteResource,
  updateAndDeleteResourceCategory,
  viewResource,
} from "../../redux/actions/resource";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ResourceLists from "./ResourceLists";
import ResourceCategoryLists from "./ResourceCategoryLists";
import AddEditCategory from "./AddEditCategory";
import ViewResourceModal from "../../components/modal/ViewResource";

const Resource = () => {
  const dispatch = useDispatch();
  const {
    resourceList,
    categoryList,
    categoryLoading,
    resourceCategoryOptions,
  } = useSelector((state) => state?.resource);
  const [search, setSearch] = useState("");
  const [resourceLists, setResourceLists] = useState([]);
  const [modalAction, setModalAction] = useState("default");
  const [loading, setLoading] = useState(false);
  const [resourceInitialValues, setResourceInitialValues] = useState({
    organization: "",
    resource_details: "",
    website: "",
    email: "",
    phone: "",
    categoryId: "",
    category: [{ label: null, value: null }],
    attachment_name: "",
    files: [],
    eligibility: "",
    resource_name: "",
    id: "",
  });
  const [viewResourceData, setViewResourceData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [addEditLoading, setAddEditLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [debounceTime, setDebounceTime] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [categoryInitialValues, setCateGoryInitialValues] = useState({
    category: "",
    id: "",
  });
  const [categoryLists, setCategoryLists] = useState([]);
  const [viewData, setViewData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    let payload = {
      name: "",
    };
    dispatch(
      setActiveHeader({ name: "resource", heading: "All Given Resources" })
    );
    dispatch(getResourceCategoryList({ payload: { name: "" } }));
    dispatch(getAllResource({ payload }));
    dispatch(getResourceCategoryOption({ payload: { search: "" } }));
  }, []);

  useEffect(() => {
    resourceList.length ? setResourceLists(resourceList) : setResourceLists([]);
  }, [resourceList]);

  useEffect(() => {
    categoryList.length ? setCategoryLists(categoryList) : setCategoryLists([]);
  }, [categoryList]);

  const handleClickModal = (action, isOpen, data) => {
    setResourceInitialValues({
      organization: "",
      resource_details: "",
      website: "",
      email: "",
      phone: "",
      category: [{ label: "", value: "" }],
      attachment_name: "",
      files: [],
      categoryId: "",
      eligibility: "",
      resource_name: "",
      id: "",
    });
    switch (action) {
      case "addResource":
        setModalAction(action);
        break;
      case "viewResource":
        setModalAction(action);
        setViewResourceData(data);
        break;
      case "editResource":
        setResourceInitialValues((prev) => ({
          ...prev,
          ...data,
          id: data?.key,
          category: [{ label: data?.category, value: data?.categoryId }],
        }));
        setModalAction(action);
        break;
      case "deleteResource":
        setModalAction(action);
        setOpenDeleteModal(isOpen);
        setResourceInitialValues((prev) => ({
          ...prev,
          id: data?.key,
        }));
        setDescription("Are you sure you want to delete this resource.");
        setTitle("Delete Resource.");
        break;
      case "addCategory":
        setModalAction(action);
        break;
      case "editCategory":
        setModalAction(action);
        setCateGoryInitialValues({ category: data?.category, id: data?.key });
        break;
      case "deleteCategory":
        setModalAction(action);
        setOpenDeleteModal(isOpen);
        setCateGoryInitialValues({ category: data?.category, id: data?.key });
        setDescription("Are you sure you want to delete this category.");
        setTitle("Delete Category.");
        break;
      default:
        break;
    }
  };

  const handleDispatchAction = (action, data) => {
    switch (action) {
      case "addResource":
        setLoading(true);
        data.validateFields().then((values) => {
          setAddEditLoading(true);
          const extension = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "video/mp4",
            "video/mov",
            "image/avi",
            "audio/mpeg",
            "application/pdf",
          ];
          if (values?.files?.every((file) => extension?.includes(file?.type))) {
            setAddEditLoading(true);
            dispatch(createResource({ payload: values })).then((res) => {
              if (res?.payload?.status === true) {
                setAddEditLoading(false);
                setLoading(false);
                message.success("Resource created successfully!");
                setModalAction("default");
                data.resetFields();
                dispatch(getAllResource({ payload: { name: "" } }));
              }
            });
          } else {
            setLoading(true);
            dispatch(createResource({ payload: values })).then((res) => {
              if (res?.payload?.status === true) {
                setResourceLists((prev) => [res?.payload?.data, ...prev]);
                data.resetFields();
                modalClose();
                message.success("Resource created successfully!");
                setAddEditLoading(false);
                setLoading(false);
                dispatch(getAllResource({ payload: { name: "" } }));
              }
            });
          }
        });

        break;
      case "viewResource":
        setAddEditLoading(true);
        dispatch(viewResource(data.id)).then((res) => {
          if (res?.payload?.status === true) {
            setViewData(res?.payload?.data);
            setAddEditLoading(false);
          }
        });
        break;
      case "editResource":
        setLoading(true);
        data.validateFields().then((values) => {
          let payload = {
            ...values,
            category: Array.isArray(values?.category)
              ? values?.category[0]?.value
              : values?.category,
            id: resourceInitialValues?.id,
            isUpdated: true,
          };

          const formData = new FormData();
          formData.append("organization", payload.organization);
          formData.append("resource_name", payload.resource_name);
          formData.append("resource_details", payload.resource_details);
          formData.append("category", payload.category);
          formData.append("website", payload.website);
          formData.append("email", payload.email);
          formData.append("phone", payload.phone);
          formData.append("eligibility", payload.eligibility);
          formData.append("attachment_name", payload.attachment_name);
          payload.files.forEach((file) => {
            if (typeof file === "string") {
              formData.append("file_urls", file);
            } else if (file.originFileObj) {
              formData.append("files", file.originFileObj);
            }
          });

          formData.append("id", payload.id);
          formData.append("isUpdated", payload.isUpdated);

          setAddEditLoading(true);
          dispatch(updateAndDeleteResource({ formData })).then((res) => {
            if (res?.payload?.status === true) {
              setResourceLists((prev) =>
                prev?.map((resource) =>
                  resource?._id === res?.payload?.data?._id
                    ? res?.payload?.data
                    : resource
                )
              );
              modalClose();
              setAddEditLoading(false);
              setLoading(false);
              message.success("Resource updated successfully!");
              dispatch(getAllResource({ payload: { name: "" } }));
            }
          });
        });
        break;
      case "deleteResource":
        setLoading(true);
        let formData = {
          id: resourceInitialValues?.id,
          isDeleted: true,
        };
        setAddEditLoading(true);
        dispatch(updateAndDeleteResource({ formData })).then((res) => {
          if (res?.payload?.status === true) {
            setResourceLists((prev) =>
              prev?.filter(
                (resource) => resource?._id !== res?.payload?.data?._id
              )
            );
            modalClose();
            setOpenDeleteModal(false);
            setAddEditLoading(false);
            setModalAction("default");
            setLoading(false);
            message.success("Resource deleted successfully!");
            dispatch(getAllResource({ payload: { name: "" } }));
          }
        });
        break;
      case "addCategory":
        setLoading(true);
        setAddEditLoading(true);
        dispatch(
          createResourceCategory({ payload: { name: data?.category } })
        ).then((res) => {
          if (res?.payload?.status === true) {
            setCategoryLists((prev) => [res?.payload?.data, ...prev]);
            setAddEditLoading(false);
            setLoading(false);
            message.success("Category created successfully!");
            modalClose();
          }
        });
        break;
      case "editCategory":
        setLoading(true);
        let categoryPayload = {
          resource_category: data?.category,
          id: categoryInitialValues?.id,
          isUpdated: true,
        };
        setAddEditLoading(true);
        dispatch(
          updateAndDeleteResourceCategory({ payload: categoryPayload })
        ).then((res) => {
          if (res?.payload?.status === true) {
            setCategoryLists((prev) =>
              prev?.map((prevItem) =>
                prevItem?._id === res?.payload?.data?._id
                  ? res?.payload?.data
                  : prevItem
              )
            );
            setAddEditLoading(false);
            setLoading(false);
            message.success("Category updated successfully!");
            modalClose();
          }
        });
        break;
      case "deleteCategory":
        setLoading(true);
        let deleteCategoryPayload = {
          id: categoryInitialValues?.id,
          isDeleted: true,
        };
        setAddEditLoading(true);
        dispatch(
          updateAndDeleteResourceCategory({ payload: deleteCategoryPayload })
        ).then((res) => {
          if (res?.payload?.status === true) {
            setCategoryLists((prev) =>
              prev?.filter(
                (preItem) => preItem?._id !== res?.payload?.data?._id
              )
            );
            setCateGoryInitialValues({ category: "", id: "" });
            setOpenDeleteModal(false);
            setAddEditLoading(false);
            setModalAction("default");
            setLoading(false);
            message.success("Category deleted successfully!");
          }
        });
        break;
      default:
        break;
    }
  };

  const modalClose = () => {
    setModalAction("default");
    setAddEditLoading(false);
    setTimeout(() => {
      setResourceInitialValues({
        organization: "",
        resource_details: "",
        website: "",
        email: "",
        phone: "",
        categoryId: "",
        category: [{ label: null, value: null }],
        eligibility: "",
        resource_name: "",
        id: "",
        attachment_name: "",
        files: [],
      });
      setCateGoryInitialValues({ category: "", id: "" });
    }, 100);
    setCateGoryInitialValues({ category: "", id: "" });
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue, selectedCategory]);

  const handleSearch = () => {
    let newTime;
    clearTimeout(debounceTime);
    if (activeTab === 1) {
      newTime = setTimeout(() => {
        dispatch(
          getAllResource({
            payload: {
              name: searchValue,
              category: selectedCategory,
            },
          })
        );
      }, 500);
      setPageNo(1);
      setPageSize(25);
    } else if (activeTab == 2) {
      newTime = setTimeout(() => {
        dispatch(getResourceCategoryList({ payload: { name: searchValue } }));
      }, 500);
      setPageNo(1);
      setPageSize(25);
    }
    setDebounceTime(newTime);
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setSelectedCategory(null);

    if (activeTab === 1) {
      dispatch(
        getAllResource({
          payload: {
            name: "",
            category: null,
          },
        })
      );
    } else if (activeTab === 2) {
      dispatch(getResourceCategoryList({ payload: { name: "" } }));
    }
  };

  const resourceItems = [
    {
      key: 1,
      label: "Resources",
      children: (
        <ResourceLists
          resourceLists={resourceLists}
          handleClickModal={handleClickModal}
          loading={loading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
        />
      ),
    },
    {
      key: 2,
      label: "Categories",
      children: (
        <ResourceCategoryLists
          categoryLists={categoryLists}
          handleClickModal={handleClickModal}
          loading={categoryLoading}
          pageNo={pageNo}
          pageSize={pageSize}
          setPageNo={setPageNo}
          setPageSize={setPageSize}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchValue("");
    setSelectedCategory(null);

    if (key === 1) {
      dispatch(getAllResource({ payload: { name: "", category: null } }));
      dispatch(getResourceCategoryOption({ payload: { search: "" } }));
    } else if (key === 2) {
      dispatch(getResourceCategoryList({ payload: { name: "" } }));
    }
  };

  return (
    <>
      <div>
        <div className="status-sec">
          <div className="status-sec-left">
            <div className="dashboard-heading">
              {activeTab === 1 ? "All Resource" : "All Resource Category"}
            </div>
          </div>
          <div className="status-sec-right">
            <Button
              onClick={handleClearFilter}
              disabled={!searchValue && !selectedCategory}
            >
              Clear Filter
            </Button>
            <div style={{ display: "flex" }}>
              <Search
                handleOnChangeSearch={(value) => setSearchValue(value)}
                placeholder={`Search ${
                  activeTab === 1 ? "resource" : "category"
                }`}
                value={searchValue}
              />
              {activeTab === 1 && (
                <Select
                  placeholder="Select category"
                  options={[
                    { label: "None", value: "none" },
                    ...resourceCategoryOptions,
                  ]}
                  onChange={(value) => {
                    setSelectedCategory(value === "none" ? "" : value);
                  }}
                  value={selectedCategory}
                />
              )}
            </div>
            <div className="request-btn">
              <Button
                type="primary"
                className="yellow-btn"
                icon={pluseIcon}
                onClick={() =>
                  handleClickModal(
                    activeTab === 1 ? "addResource" : "addCategory",
                    true
                  )
                }
              >
                {activeTab === 1 ? "ADD Resource" : "ADD Category"}
              </Button>
            </div>
          </div>
        </div>
        <div className="user_table_wrapper">
          <Tabs
            items={resourceItems}
            onChange={handleTabChange}
            activeKey={activeTab}
          />
        </div>
      </div>
      <AddEditResource
        modalAction={modalAction}
        isOpen={modalAction === "addResource" || modalAction === "editResource"}
        handleClickModal={handleClickModal}
        modalClose={modalClose}
        initialValues={resourceInitialValues}
        handleDispatchAction={handleDispatchAction}
        confirmLoading={addEditLoading}
        loading={loading}
      />
      <ViewResourceModal
        modalAction={modalAction}
        isOpen={modalAction === "viewResource"}
        handleClickModal={handleClickModal}
        modalClose={modalClose}
        initialValues={viewResourceData}
        handleDispatchAction={handleDispatchAction}
        confirmLoading={addEditLoading}
        viewData={viewData}
      />
      <AddEditCategory
        modalAction={modalAction}
        isOpen={modalAction === "addCategory" || modalAction === "editCategory"}
        handleDispatchAction={handleDispatchAction}
        modalClose={modalClose}
        initialValues={categoryInitialValues}
        confirmLoading={addEditLoading}
        loading={loading}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        confirmLoading={addEditLoading}
        description={description}
        handleDispatchAction={handleDispatchAction}
        modalAction={modalAction}
        title={title}
        loading={loading}
      />
    </>
  );
};

export default Resource;
