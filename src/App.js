import React, { useState, useEffect, useReducer } from "react";
import { Form, Input, Button } from "antd";

const BASE_URL = "https://fed-challenge-api.sure.now.sh";

const quote = (state, action) => {
  switch (action.type) {
    case "SET_QUOTE":
      return { ...state, quote: action.payload.quote };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      };
    case "NEXT_PAGE":
      return {
        ...state,
        onFormPage: action.payload.onFormPage,
      };
    default:
      throw new Error();
  }
};

const initState = {
  quote: {},
  onFormPage: true,
  loading: false,
};

const useFetch = (endpoint) => {
  const [state, dispatch] = useReducer(quote, initState);

  // const [formState, setFormState] = useState({});
  // const [formPage, setFormPage] = useState(true);
  const setQuote = (quote) =>
    dispatch({
      type: "SET_QUOTE",
      payload: quote,
    });
  const setLoading = (loading) =>
    dispatch({
      type: "SET_LOADING",
      payload: { loading },
    });
  const nextPage = () =>
    dispatch({
      type: "NEXT_PAGE",
      payload: { onFormPage: false },
    });
  // const setSelection = () =>
  //   dispatch({
  //     type: "NEXT_PAGE",
  //     payload: { onFormPage: false },
  //   });

  const fetchAt = (api, method, body) => {
    setLoading(true);
    fetch(endpoint + api, {
      method: method,
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        // if (method == "POST") {
        setQuote(data);
        nextPage();
        // }
        // if (method == "PUT") {
        // }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  function putRequest(quoteId, body) {
    // setLoading(true);

    fetch(`https://fed-challenge-api.sure.now.sh/api/v1/quotes/${quoteId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("josn", json);
        setQuote(json);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  return [state, dispatch, fetchAt, putRequest];
};

function App() {
  const [state, dispatch, fetchAt, putRequest] = useFetch(BASE_URL);

  function handleChange(event) {
    const {
      target: { name, value },
    } = event;
    const putBody = {
      quote: {
        quoteId: state.quote.quoteId,
        rating_address: state.quote.rating_address,
        policy_holder: state.quote.policy_holder,
        variable_selections: {
          ...state.quote.variable_selections,
          [name]: value,
        },
      },
    };
    // putRequest(`/api/v1/quotes/${state.quote.quoteId}`, "PUT", putBody);
    putRequest(state.quote.quoteId, putBody);
  }

  const onFinish = (state) => {
    const orderedFormState = {
      first_name: state.first_name,
      last_name: state.last_name,
      address: {
        line_1: state.line_1,
        line_2: state.line_2 || "",
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
  if (state.loading) {
    return <div>loading..</div>;
  }
  if (!state.onFormPage) {
    return (
      <div>
        <div>name</div>
        <div>
          {state.quote.policy_holder.first_name +
            " " +
            state.quote.policy_holder.last_name}
        </div>
        <div>{state.quote.variable_options.asteroid_collision.title}</div>
        <div>{state.quote.variable_options.asteroid_collision.description}</div>
        <select onChange={handleChange} name="asteroid_collision">
          {state.quote.variable_options.asteroid_collision.values.map(
            (val, idx) => (
              <option key={idx} value={val}>
                {val}
              </option>
            )
          )}
        </select>

        <div>{state.quote.variable_options.deductible.title}</div>
        <div>{state.quote.variable_options.deductible.description}</div>
        <select onChange={handleChange} name="deductible">
          {state.quote.variable_options.deductible.values.map((val, idx) => (
            <option key={idx} value={val}>
              {val}
            </option>
          ))}
        </select>
        <div>premium</div>
        <div>{state.quote.premium}</div>
      </div>
    );
  }
  return (
    <div className="App">
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
      {/* <>
          {formState.quote ? (
            
          ) : (
            "loading"
          )}
        </>
      )} */}
    </div>
  );
}

export default App;
