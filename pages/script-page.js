import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Layout,
  Page,
  ResourceList,
  Stack,
} from "@shopify/polaris";

const CREATE_SCRIPT_TAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const QUERY_SCRIPT_TAGS = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          src
          displayScope
        }
      }
    }
  }
`;

const DELETE_SCRIPT_TAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;

function ScriptPage() {
  const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
  const [deleteScripts] = useMutation(DELETE_SCRIPT_TAG);
  const { loading, error, data } = useQuery(QUERY_SCRIPT_TAGS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="These are the script tags:" sectioned>
            <p>Create or Delete script tags</p>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Delete tag" sectioned>
            <Button
              primary
              size="slim"
              type="submit"
              onClick={() => {
                createScripts({
                  variables: {
                    input: {
                      src: "https://7909f0466743.ngrok.io/test-script.js",
                      displayScope: "ORDER_STATUS",
                    },
                  },
                  refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
                });
              }}
            >
              Create script tag
            </Button>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <ResourceList
              showHeader
              resourceName={{ singular: "Script", plural: "Scripts" }}
              items={data.scriptTags.edges}
              renderItem={(item) => {
                return (
                  <ResourceList.Item id={item.node.id}>
                    <Stack>
                      <Stack.Item>
                        <p>{item.node.id}</p>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          primary
                          type="submit"
                          onClick={() => {
                            deleteScripts({
                              variables: {
                                id: item.node.id,
                              },
                              refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
                            });
                          }}
                        >
                          Delete tag
                        </Button>
                      </Stack.Item>
                    </Stack>
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );

  return (
    <div>
      <h1>Script tags</h1>
      <Button
        type="submit"
        onClick={() => {
          createScripts({
            variables: {
              input: {
                src: "https://7909f0466743.ngrok.io/test-script.js",
                displayScope: "ALL",
              },
            },
            refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
          });
        }}
      >
        Create script tag
      </Button>
      {data.scriptTags.edges.map((item) => {
        return (
          <div key={item.node.id}>
            <p>{item.node.id}</p>
            <Button
              type="submit"
              onClick={() => {
                deleteScripts({
                  variables: {
                    id: item.node.id,
                  },
                  refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
                });
              }}
            >
              Delete this script tag
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default ScriptPage;
