import React, { useReducer, createContext, useContext } from "react";
import { Form, Input, Button, Select, Layout } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import FirstFormPage from "./FirstFormPage";
import SecondPage from "./SecondPage";

const { Header, Footer, Content } = Layout;
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

  const fetchAt = (api, method, body) => {
    setLoading(true);
    fetch(endpoint + api, {
      method: method,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setQuote(data);
        nextPage();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return [fetchAt];
};

export const QuoteContext = createContext();

const QuoteContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quote, initState);
  const [fetchAt] = useFetch(BASE_URL);

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

  function handleChange(val, key) {
    const putBody = {
      quote: {
        quoteId: state.quote.quoteId,
        rating_address: state.quote.rating_address,
        policy_holder: state.quote.policy_holder,
        variable_selections: {
          ...state.quote.variable_selections,
          [key]: parseInt(val),
        },
      },
    };
    fetchAt(`/api/v1/quotes/${state.quote.quoteId}`, "PUT", putBody);
  }

  const value = { state, onFinish, onFinishFailed, handleChange };

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
};

function App() {
  const { Option } = Select;
  // const [state, fetchAt] = useFetch(BASE_URL);
  const { state } = useContext(QuoteContext);

  if (state.loading) {
    return <div>loading...</div>;
  }

  return (
    <Layout className="layout">
      <Header className="header">Rocket Insurance</Header>
      <Content className="content">
        <QuoteContextProvider>
          {/* acts like router */}
          {state.onFormPage ? <FirstFormPage /> : <SecondPage />}
        </QuoteContextProvider>
      </Content>
      <Footer>Rocket.co</Footer>
    </Layout>
  );
}

export default App;
