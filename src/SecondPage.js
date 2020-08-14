import React, { useContext } from "react";
import { Form, Select } from "antd";
import { QuoteContext } from "./index";

const SecondPage = () => {
  const { Option } = Select;
  const { state, handleChange } = useContext(QuoteContext);
  const {
    quote: { policy_holder, variable_options, variable_selections, premium },
  } = state;
  return (
    <Form className="formStyles">
      <div>name</div>
      <div>{policy_holder.first_name + " " + policy_holder.last_name}</div>
      <div>{variable_options.asteroid_collision.title}</div>
      <div>{variable_options.asteroid_collision.description}</div>
      <Form.Item name="first_name">
        <Select
          onChange={(val) => handleChange(val, "asteroid_collision")}
          name="asteroid_collision"
          defaultValue={variable_selections.asteroid_collision}
        >
          {variable_options.asteroid_collision.values.map((val, idx) => (
            <Option key={idx} value={val}>
              {val}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div>{variable_options.deductible.title}</div>
      <div>{variable_options.deductible.description}</div>
      <Form.Item name="deductible">
        <Select
          onChange={(val) => handleChange(val, "deductible")}
          name="deductible"
          defaultValue={variable_selections.deductible}
        >
          {variable_options.deductible.values.map((val, idx) => (
            <Option key={idx} value={val}>
              {val}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <div>premium</div>
      <div>{premium}</div>
    </Form>
  );
};

export default SecondPage;
