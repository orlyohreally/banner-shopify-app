import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import translations from "@shopify/polaris/locales/en.json";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const config = {
      apiKey: API_KEY,
      appURL: APP_URL,
      shopOrigin: Cookies.get("shopOrigin"),
      forceRedirect: true,
    };
    console.log({ props: config });
    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@shopify/polaris@4.7.0/styles.min.css"
          />
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <ApolloHooksProvider client={client}>
              <Component
                {...{
                  ...pageProps,
                  shopOrigin: config.shopOrigin,
                  appURL: config.appURL,
                }}
              />
            </ApolloHooksProvider>
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;
