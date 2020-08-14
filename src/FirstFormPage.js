import React, { useContext } from "react";
import { Form, Input, Button } from "antd";
import { QuoteContext } from "./QuoteContextProvider";

const FirstFormPage = () => {
  const { onFinish, onFinishFailed } = useContext(QuoteContext);

  return (
    <div>
      <span>Enter your info</span>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="formStyles"
      >
        {/* can use map to create all form items */}
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address line 1"
          name="line_1"
          rules={[
            {
              required: true,
              message: "Please input your address!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Line 2" name="line_2" rules={[]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "Please input your city!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Region"
          name="region"
          rules={[
            {
              required: true,
              message: "Please input your region!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* form validations for 5 numbers */}
        <Form.Item
          label="Postal"
          name="postal"
          rules={[
            {
              required: true,
              message: "Please input your postal!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      ;
    </div>
  );
};

export default FirstFormPage;
