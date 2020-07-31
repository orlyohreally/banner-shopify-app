import React, { useState } from "react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import axios from "axios";

import ProductList from "../components/ProductList";

function Index(props) {
  const [modal, setModal] = useState({ open: false });
  const emptyState = !store.get("ids");

  function handleSelection(resources) {
    const idsFromResources = resources.selection.map((product) => product.id);
    setModal({ open: false });
    store.set("ids", idsFromResources);
    deleteAllProducts();
    addProduct(resources.selection);
    console.log(store.get("ids"));
  }

  async function addProduct(products) {
    const url = "/api/products";
    axios
      .post(url, { products })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deleteAllProducts() {
    const url = "/api/products";
    axios
      .delete(url)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: "Select new products",
          onAction: () => {
            setModal({ open: true });
          },
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onSelection={(resources) => handleSelection(resources)}
      />
      {emptyState ? (
        <Layout>
          <EmptyState
            heading="Manage your inventory"
            action={{
              content: "Select products",
              onAction: () => setModal({ open: true }),
            }}
            secondaryAction={{
              content: "Learn more",
              url: "https://help.shopify.com",
            }}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p>Select Products</p>
          </EmptyState>
        </Layout>
      ) : (
        <ProductList></ProductList>
      )}
    </Page>
  );
}

export default Index;
