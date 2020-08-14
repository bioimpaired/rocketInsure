import React, { useReducer, createContext, useContext, useEffect } from "react";
const BASE_URL = "https://fed-challenge-api.sure.now.sh";

// put in reducer file
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

// put in own file
const useFetch = (endpoint) => {
  const [state, dispatch] = useReducer(quote, initState);
  console.log("usefetch state", state);
  const setQuote = (quote) =>
    dispatch({
      type: "SET_QUOTE",
      payload: quote,
    });
  const setLoading = (loading) => {
    console.log("loing setting ", loading);
    return dispatch({
      type: "SET_LOADING",
      payload: { loading },
    });
  };

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
        console.log("got ot the then in fetchat", data);
        setQuote(data);
        nextPage();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return [state, fetchAt];
};
export const QuoteContext = createContext();

const QuoteContextProvider = ({ children }) => {
  const [state, fetchAt] = useFetch(BASE_URL);

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
    console.log("clicking submit");
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

export default QuoteContextProvider;
