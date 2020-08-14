import React, { useContext } from "react";
import { Layout, Spin } from "antd";
import "antd/dist/antd.css";
import "./App.css";

import FirstFormPage from "./FirstFormPage";
import SecondPage from "./SecondPage";
import { QuoteContext } from "./QuoteContextProvider";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const { state } = useContext(QuoteContext);

  if (state.loading) {
    return <Spin />;
  }

  return (
    <Layout className="layout">
      <Header className="header">Rocket Insurance</Header>
      <Content className="content">
        {/* acts like router */}
        {state.onFormPage ? <FirstFormPage /> : <SecondPage />}
      </Content>
      <Footer>Rocket.co</Footer>
    </Layout>
  );
};

export default App;
