import { CloseOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import {
  ClientVisitType,
  objectiveTypeOptions,
  programOptions,
  typeValueOption,
} from "../../../constant/array";
import { disabledDate } from "../../../helpers";

const AdvanceFilter = ({
  filter,
  byAge,
  form,
  byEthnicity,
  byLanguage,
  byResourceName,
  byPrononuce,
  byProgram,
  ethnicityOptions,
  languageOptions,
  pronounceOptions,
  byType,
  byValue,
  byFollowUp,
  byVisitDate,
  byVisitType,
  byZipcode,
  byPriority,
  byResource,
  resourceOptions,
  byDueDate,
  byCategory,
  byDate,
  zipOptions,
  setOpenFilter,
  handleFilterChange,
  handleSearch,
  nextImportantDateCategory,
  organizationList,
  byOrganization,
  byPathwayStatus,
}) => {
  const closeFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        {filter === "client" && (
          <>
            <Form.Item label="Select zipcode" name={"byZipcode"}>
              <Select
                value={byZipcode}
                options={[{ label: "None", value: "none" }, ...zipOptions]}
                placeholder="Select zipcode"
                onChange={(value) => handleFilterChange("byZipcode", value)}
                onSearch={(value) => handleSearch("byZipcode", value)}
                showSearch
                filterOption={false}
              />
            </Form.Item>
            <Form.Item label="Select program" name={"byProgram"}>
              <Select
                value={byProgram}
                options={[{ label: "None", value: "none" }, ...programOptions]}
                placeholder="Select program"
                onChange={(value) => handleFilterChange("byProgram", value)}
              />
            </Form.Item>
            <Form.Item label="Select ethnicity" name={"byEthnicity"}>
              <Select
                value={byEthnicity}
                options={[
                  { label: "None", value: "none" },
                  ...ethnicityOptions,
                ]}
                placeholder="Select ethnicity"
                onChange={(value) => handleFilterChange("byEthnicity", value)}
              />
            </Form.Item>
            <Form.Item label="Select pronounce" name={"byPrononuce"}>
              <Select
                value={byPrononuce}
                options={[
                  { label: "None", value: "none" },
                  ...pronounceOptions,
                ]}
                placeholder="Select pronounce"
                onChange={(value) => handleFilterChange("byPrononuce", value)}
              />
            </Form.Item>
            <Form.Item label="Select language" name={"byLanguage"}>
              <Select
                value={byLanguage}
                options={[{ label: "None", value: "none" }, ...languageOptions]}
                placeholder="Select language"
                onChange={(value) => handleFilterChange("byLanguage", value)}
              />
            </Form.Item>
            <Form.Item label="Enter age">
              <InputNumber
                placeholder="Enter age"
                value={byAge}
                min={1}
                max={125}
                onChange={(value) => handleFilterChange("byAge", value)}
              />
            </Form.Item>
          </>
        )}
        {(filter === "nextImportant" || filter === "actionSteps") && (
          <Form.Item label="Select category" name={"byCategory"}>
            <Select
              value={byCategory}
              options={[
                { label: "None", value: "none" },
                ...nextImportantDateCategory,
              ]}
              placeholder="Select category"
              onChange={(value) => handleFilterChange("byCategory", value)}
            />
          </Form.Item>
        )}
        {filter === "actionSteps" && (
          <>
            <Form.Item label="Select resource" name={"byResource"}>
              <Select
                value={byResource}
                options={[{ label: "None", value: "none" }, ...resourceOptions]}
                placeholder="Select resource"
                onChange={(value) => handleFilterChange("byResource", value)}
                showSearch
                onSearch={(value) => handleSearch("byResource", value)}
                filterOption={false}
              />
            </Form.Item>
            <Form.Item label="Select priority" name={"byPriority"}>
              <Select
                value={byPriority}
                options={[
                  { label: "None", value: "none" },
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                placeholder="Select priority"
                onChange={(value) => handleFilterChange("byPriority", value)}
              />
            </Form.Item>
          </>
        )}
        {filter === "visit" && (
          <>
            <Form.Item label="Select visit type" name={"byVisitType"}>
              <Select
                value={byVisitType}
                options={[{ label: "None", value: "none" }, ...ClientVisitType]}
                placeholder="Select visit type"
                onChange={(value) => handleFilterChange("byVisitType", value)}
              />
            </Form.Item>
            {/* <Form.Item label="Select follow-up date" name={"byFollowUp"}>
                            <DatePicker value={byFollowUp} placeholder="Select follow-up date" onChange={(value) => handleFilterChange("byFollowUp", value)} format={"MM/DD/YYYY"} />
                        </Form.Item> */}
            <Form.Item label="Select visit date" name={"byVisitDate"}>
              <DatePicker
                value={byVisitDate}
                placeholder="Select visit date"
                onChange={(value) => handleFilterChange("byVisitDate", value)}
                disabledDate={(value) => disabledDate(value, "futureDate")}
                format={"MM/DD/YYYY"}
              />
            </Form.Item>
          </>
        )}
        {filter === "objective" && (
          <>
            <Form.Item label="Select objective value" name={"byValue"}>
              <Select
                value={byValue}
                options={[{ label: "None", value: "none" }, ...typeValueOption]}
                placeholder="Select objective value"
                onChange={(value) => handleFilterChange("byValue", value)}
              />
            </Form.Item>
            <Form.Item label="Select objective type" name={"byType"}>
              <Select
                value={byType}
                options={[
                  { label: "None", value: "none" },
                  ...objectiveTypeOptions,
                ]}
                placeholder="Select objective type"
                onChange={(value) => handleFilterChange("byType", value)}
              />
            </Form.Item>
          </>
        )}
        {filter === "nextImportant" && (
          <Form.Item label="Due date" name={"byDueDate"}>
            <DatePicker
              value={byDueDate}
              onChange={(value) => handleFilterChange("byDueDate", value)}
              format={"MM/DD/YYYY"}
            />
          </Form.Item>
        )}
        {filter === "resourcegiven" && (
          <>
            <Form.Item label="Select Organization" name={"byOrganization"}>
              <Input.Search
                value={byOrganization}
                placeholder="Select Organization"
                onChange={(e) =>
                  handleFilterChange("byOrganization", e.target.value)
                }
              />
            </Form.Item>
          </>
        )}
        {filter === "pathways" && (
          <Form.Item label="Select Pathway Status" name={"byPathwayStatus"}>
            <Select
              value={byPathwayStatus}
              options={[
                { label: "None", value: "none" },
                { label: "Open", value: "Open" },
                { label: "In-progress", value: "In-progress" },
                { label: "Completed", value: "Completed" },
              ]}
              placeholder="Select Pathway Status"
              onChange={(value) => handleFilterChange("byPathwayStatus", value)}
            />
          </Form.Item>
        )}
        <Form.Item label="Created Date" name={"byDate"}>
          <DatePicker.RangePicker
            value={byDate}
            onChange={(value) => handleFilterChange("byDate", value)}
            disabledDate={(value) => disabledDate(value, "futureDate")}
            format={"MM/DD/YYYY"}
          />
        </Form.Item>
        <div className="advance-close">
          <Button onClick={closeFilter}>
            <CloseOutlined />
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AdvanceFilter;
