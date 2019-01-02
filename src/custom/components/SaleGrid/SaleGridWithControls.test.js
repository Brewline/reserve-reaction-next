import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "mobx-react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "lib/theme/reactionTheme";
import SaleGridWithControls from "./SaleGridWithControls";
import sales from "./__mocks__/sales.mock";

const uiStore = {
  appConfig: {
    publicRuntimeConfig: {}
  }
};

const routingStore = {
  pathname: "tag",
  query: {
    slug: "test-tag",
    querystring: "?this&that"
  }
};

const mockComponents = {
  BadgeOverlay: "BadgeOverlay",
  SaleItem: "SaleItem",
  Link: "Link",
  Price: "Price",
  ProgressiveImage: "ProgressiveImage"
};

test("basic snapshot", () => {
  const pageInfo = {
    hasNextPage: false,
    hasPreviousPage: true,
    loadNextPage: () => {},
    loadPreviousPage: () => {},
    startCursor: "",
    endCursor: ""
  };

  const component = renderer.create((
    <MuiThemeProvider theme={theme}>
      <Provider routingStore={routingStore} uiStore={uiStore}>
        <SaleGridWithControls
          components={mockComponents}
          sales={sales}
          currencyCode="USD"
          pageInfo={pageInfo}
          pageSize={20}
          primaryShopId="123"
          setPageSize={() => true}
          setSortBy={() => true}
          sortBy={"updatedAt-desc"}
        />
      </Provider>
    </MuiThemeProvider>
  ));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Empty sale grid message", () => {
  const pageInfo = {
    hasNextPage: false,
    hasPreviousPage: true,
    loadNextPage: () => {},
    loadPreviousPage: () => {},
    startCursor: "",
    endCursor: ""
  };

  const component = renderer.create((
    <MuiThemeProvider theme={theme}>
      <Provider routingStore={routingStore} uiStore={uiStore}>
        <SaleGridWithControls
          components={mockComponents}
          sales={null}
          currencyCode="USD"
          pageInfo={pageInfo}
          pageSize={20}
          primaryShopId="123"
          setPageSize={() => true}
          setSortBy={() => true}
          sortBy={"updatedAt-desc"}
        />
      </Provider>
    </MuiThemeProvider>
  ));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
