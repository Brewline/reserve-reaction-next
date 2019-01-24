import React from "react";
import renderer from "react-test-renderer";
import * as ReactContainerQueryExports from "react-container-query";
import mockComponents from "/tests/mockComponents";
import SaleGrid from "./SaleGrid";
import mockSales from "./__mocks__/sales";

// ContainerQuery component causes errors inside `renderer.create` so we mock it
ReactContainerQueryExports.ContainerQuery = jest.fn().mockImplementation((props) => props.children({}));

test("SaleGrid default responsive snapshot", () => {
  const component = renderer.create((
    <SaleGrid
      components={mockComponents}
      sales={mockSales}
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid 325px fixed-width snapshot", () => {
  const component = renderer.create((
    <div style={{ width: 325, borderWidth: 1, borderColor: "black", borderStyle: "solid", margin: "0 auto" }}>
      <SaleGrid
        components={mockComponents}
        sales={mockSales}
      />
    </div>
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid 450px fixed-width snapshot", () => {
  const component = renderer.create((
    <div style={{ width: 450, borderWidth: 1, borderColor: "black", borderStyle: "solid", margin: "0 auto" }}>
      <SaleGrid
        components={mockComponents}
        sales={mockSales}
      />
    </div>
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid 650px fixed-width snapshot", () => {
  const component = renderer.create((
    <div style={{ width: 650, borderWidth: 1, borderColor: "black", borderStyle: "solid", margin: "0 auto" }}>
      <SaleGrid
        components={mockComponents}
        sales={mockSales}
      />
    </div>
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid 960px fixed-width snapshot", () => {
  const component = renderer.create((
    <div style={{ width: 960, borderWidth: 1, borderColor: "black", borderStyle: "solid", margin: "0 auto" }}>
      <SaleGrid
        components={mockComponents}
        sales={mockSales}
      />
    </div>
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid custom placeholder image snapshot", () => {
  const component = renderer.create((
    <SaleGrid
      components={mockComponents}
      sales={mockSales}
      placeholderImageURL={"/path/to/custom/placeholder.png"}
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid custom badge label snapshot", () => {
  const component = renderer.create((
    <SaleGrid
      components={mockComponents}
      sales={mockSales}
      badgeLabels={{
        BACKORDER: "Back Order!",
        BESTSELLER: "Best-selling Product",
        LOW_QUANTITY: "Only few left!",
        SOLD_OUT: "None Left",
        SALE: "Limited-time Sale"
      }}
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGrid contain vs fit snapshot", () => {
  const component = renderer.create((
    <SaleGrid
      components={mockComponents}
      sales={[{
        title: "Landscape",
        slug: "landscape",
        vendor: "Reaction",
        primaryImage: {
          URLs: {
            large: "/images/landscape/large.jpg",
            medium: "/images/landscape/medium.jpg",
            small: "/images/landscape/small.png",
            thumbnail: "/images/landscape/thumbnail.png"
          }
        },
        pricing: [{
          currency: {
            code: "USD"
          },
          compareAtPrice: null,
          price: 15,
          displayPrice: "$15.00"
        }],
        isSoldOut: false,
        isBackorder: false,
        isLowQuantity: false,
        hasEnded: false,
        hasNotBegin: false
      },
      {
        title: "Portrait",
        slug: "portrait",
        vendor: "Reaction",
        primaryImage: {
          URLs: {
            large: "/images/portrait/large.jpg",
            medium: "/images/portrait/medium.jpg",
            small: "/images/portrait/small.png",
            thumbnail: "/images/portrait/thumbnail.png"
          }
        },
        pricing: [{
          currency: {
            code: "USD"
          },
          compareAtPrice: null,
          price: 15,
          displayPrice: "$15.00"
        }],
        isSoldOut: false,
        isBackorder: false,
        isLowQuantity: false,
        hasEnded: false,
        hasNotBegin: false
      }]}
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
