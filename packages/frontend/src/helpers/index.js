import dayjs from "dayjs";

export const getChwOptions = (userLists) => {
  let ChwOptions = [];
  userLists?.forEach((item) => {
    if (item?.role === "CHW") {
      let obj = { ...item };
      let subObj = {
        label: obj?.firstName ? obj.firstName.charAt(0).toUpperCase() + obj.firstName.slice(1) + " " + obj.lastName.charAt(0).toUpperCase() + obj.lastName.slice(1) : null,
        value: obj?._id,
      };
      ChwOptions.push({ ...subObj });
    }
  });
  return ChwOptions;
};
export const getClientOpetions = (userLists) => {
  let clientOption = [];
  let clientZipCode = [];
  userLists?.forEach((item) => {
    if (item?.role === "Client") {
      let obj = { ...item };
      let subObj = {
        label: `${obj.firstName} ${obj?.lastName}`,
        value: obj?._id,
      };
      let subObjZipCode = {
        label: `${obj.zipCode}`,
        value: obj?.zipCode,
      };
      clientOption.push({ ...subObj });
      clientZipCode.push({ ...subObjZipCode });
    }
  });
  const uniqueValues = new Set();

  const uniqueArray = clientZipCode.filter(item => {
    // If the 'value' property is not in the Set, add it and include the object in the result
    if (!uniqueValues.has(item.value)) {
      uniqueValues.add(item.value);
      return true;
    }
    return false;
  });
  return { user: clientOption, clientZipCode: uniqueArray };

};

//For side bar
export const handleFilteredSubMenus = (role, subMenus) => {

  switch (role) {
    case "Program_Administrator":
      return subMenus?.filter(
        (item) =>
          item.id === "dashboard" ||
          item.id === "users" ||
          item.id === "request" ||
          item.id === "reports" ||
          item.id === "questionnaire" ||
          item.id === "todo" ||
          item.id === "settings" ||
          item.id === "reports" && item.subItem.find((c) => c.key === "client")
      );
    case "CHW":
      return subMenus?.filter(
        (item) =>
          item.id === "dashboard" ||
          item.id === "request" ||
          item.id === "client" ||
          item.id === "calendar" ||
          item.id === "todo" ||
          item.id === "reports"
      );
    case "Client":
      return subMenus?.filter(
        (item) =>
          item.id === "dashboard" || item.id === "request" || item.id === "todo"
      );
  }
};

export const getQuestionCategoryOptions = (categoryList) => {
  let categoryOptions = [];
  categoryList?.forEach((item) => {
    let subObj = {
      label: item?.category,
      value: item?.category,
    };
    categoryOptions.push({ ...subObj });
  });

  return categoryOptions;
};
//For default profile image
export const getProfileImage = (user) => {
  const S3_BASE_URL = import.meta.env.VITE_APP_S3_BASE_URL;

  if (user?.profileImage) {
    return user.profileImage.startsWith('http') ? user.profileImage : S3_BASE_URL + user.profileImage; // uploads are stored as full URLs
  } else {
    const initials =
      (user?.firstName?.charAt(0) || "") + (user?.lastName?.charAt(0) || "");
    return `https://ui-avatars.com/api/?name=${initials}&background=random`;
  }
};

//For get user role
export const getUserRole = (role) => {
  switch (role) {
    case "Program_Administrator":
      return "Program Administrator";

    case "CHW":
      return "Community Health Worker";

    case "Client":
      return "";

    default:
      break;
  }
};

//For change date time
export const changeDateTime = (date) => {
  const originaleDate = new Date(date);
  const formattedDate = originaleDate?.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
};

export const getNumericDate = (fdate) => {
  const date = new Date(fdate);
  if (isNaN(date)) {
    return "-"
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
};

export const getVisitDate = (fdate) => {
  const date = new Date(fdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}`;
};
//For full date timne
export const getFullDateTime = (date) => {
  const originalDate = new Date(date);
  if (isNaN(originalDate)) {
    return "-"
  }
  const day = ('0' + originalDate.getDate()).slice(-2);
  const month = ('0' + (originalDate.getMonth() + 1)).slice(-2);
  const year = originalDate.getFullYear();
  let hours = originalDate.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  const minutes = ('0' + originalDate.getMinutes()).slice(-2);
  const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  return formattedDate
};

//For Disable future date
export const disabledDate = (current, disableDateType) => {
  switch (disableDateType) {
    case "futureDate":
      return current && current > dayjs().endOf("day");
    case "pastDate":
      return current && current < dayjs().startOf("day");
    default:
      return
  }
}

export const disabledBirthDate = (current) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return current && current > eighteenYearsAgo
}

export const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

//For sort request type
export const sortRequestType = (a, b) => {
  const indexA = a?.indexOf(a);
  const indexB = b?.indexOf(b);

  // If both values are in the customSortOrder array, compare their positions
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }

  // If only one value is in the customSortOrder array, prioritize it
  if (indexA !== -1) {
    return -1;
  }

  if (indexB !== -1) {
    return 1;
  }
};

//For handle request table action
export const handleRequestStatus = (role, status) => {
  switch (role) {
    case "Program_Administrator":
      if (status === "Submitted") {
        return "-";
      } else if (status === "Accepted") {
        return "-";
      } else {
        return status;
      }
    case "CHW":
      if (status === "Submitted") {
        return "-";
      } else if (status === "Accepted") {
        return "-";
      } else {
        return status;
      }
    case "Client":
      return status;
    default:
      break;
  }
};

//For assign question options
export const getQuestionOptions = (questionLists) => {
  let temarra = [];
  if (questionLists?.length > 0) {
    questionLists?.forEach((item) => {
      let obj = { ...item };
      let subObj = {
        label: obj?.question,
        value: obj?.question,
      };
      temarra?.push({ ...subObj });
    });
  }
  return temarra;
};

export const getVisitRequestList = (requestLists, visitId) => {
  return requestLists?.reduce((acc, typeObj) => {
    const filteredRequests = typeObj.requestId.filter((item) => {
      return item?.visitId === visitId && item?.request_status !== "Completed" && !item?.isArchive;
    });

    return acc.concat(filteredRequests);
  }, []);
};


export const DisableSorting = (index, pageNo, pageSize) => {
  return (pageNo - 1) * pageSize + index + 1;
}
