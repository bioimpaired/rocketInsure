import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";

const BASE_URL = "https://fed-challenge-api.sure.now.sh";
const useFetch = (endpoint) => {
  const [formState, setFormState] = useState({});
  const [formPage, setFormPage] = useState(true);

  const fetchAt = (api, method, body) => {
    fetch(endpoint + api, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormState((state) => ({ ...state, ...data }));
        setFormPage(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return [formState, formPage, fetchAt, setFormState];
};

function App() {
  const [formState, formPage, fetchAt, setFormState] = useFetch(BASE_URL);
  function putRequest(quoteId, body) {
    return fetch(
      `https://fed-challenge-api.sure.now.sh/api/v1/quotes/${quoteId}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    ).then((response) => response.json());
  }
  function handleChange(event) {
    const {
      target: { name, value },
    } = event;

    const quoteId = formState.quote.quoteId;
    const putBody = {
      quote: {
        quoteId: quoteId,
        rating_address: formState.quote.rating_address,
        policy_holder: formState.quote.policy_holder,
        variable_selections: {
          ...formState.quote.variable_selections,
          [name]: value,
        },
      },
    };

    console.log("put boty", putBody);
    putRequest(quoteId, putBody)
      .then((json) => {
        setFormState(json);
      })
      .catch((error) => error);
  }
  const onFinish = (state) => {
    const orderedFormState = {
      first_name: state.first_name,
      last_name: state.last_name,
      address: {
        line_1: state.line_1,
        line_2: state.line_2,
        city: state.city,
        region: state.region,
        postal: state.postal,
      },
    };
    fetchAt("/api/v1/quotes", "POST", orderedFormState);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="App">
      {formPage ? (
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
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
      ) : (
        <>
          {formState.quote ? (
            <div>
              <div>name</div>
              <div>
                {formState.quote.policy_holder.first_name +
                  " " +
                  formState.quote.policy_holder.last_name}
              </div>
              <div>
                {formState.quote.variable_options.asteroid_collision.title}
              </div>
              <div>
                {
                  formState.quote.variable_options.asteroid_collision
                    .description
                }
              </div>
              <select onChange={handleChange} name="asteroid_collision">
                {formState.quote.variable_options.asteroid_collision.values.map(
                  (val, idx) => (
                    <option key={idx} value={val}>
                      {val}
                    </option>
                  )
                )}
              </select>

              <div>{formState.quote.variable_options.deductible.title}</div>
              <div>
                {formState.quote.variable_options.deductible.description}
              </div>
              <select onChange={handleChange} name="deductible">
                {formState.quote.variable_options.deductible.values.map(
                  (val, idx) => (
                    <option key={idx} value={val}>
                      {val}
                    </option>
                  )
                )}
              </select>
              <div>premium</div>
              <div>{formState.quote.premium}</div>
            </div>
          ) : (
            "loading"
          )}
        </>
      )}
    </div>
  );
}

export default App;
