import React from "react";
import renderer from "react-test-renderer";
import mockComponents from "/tests/mockComponents";
import SaleGridItem from "./SaleGridItem";

test("SaleGridItem basic snapshot", () => {
  const component = renderer.create((
    <SaleGridItem
      components={mockComponents}
      placeholderImageURL="/resources/placeholder.gif"
      sale={{
        title: "Basic Reaction Product",
        slug: "basic-reaction-sale",
        vendor: "Example Manufacturer",
        primaryImage: {
          URLs: {
            large: "/images/sticker/large.jpg",
            medium: "/images/sticker/medium.jpg",
            small: "/images/sticker/small.png",
            thumbnail: "/images/sticker/thumbnail.png"
          }
        },
        pricing: [{
          currency: {
            code: "USD"
          },
          displayPrice: "$12.99 - $19.99"
        }],
        isSoldOut: false,
        isBackorder: false,
        isLowQuantity: false,
        hasEnded: false,
        hasNotBegin: false
      }}
      currencyCode="USD"
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("SaleGridItem with placeholder image", () => {
  const component = renderer.create((
    <SaleGridItem
      components={mockComponents}
      placeholderImageURL="/resources/placeholder.gif"
      sale={{
        title: "Basic Reaction Product",
        slug: "basic-reaction-sale",
        vendor: "Example Manufacturer",
        primaryImage: null,
        pricing: [{
          currency: {
            code: "USD"
          },
          displayPrice: "$12.99 - $19.99"
        }],
        isSoldOut: false,
        isBackorder: false,
        isLowQuantity: false,
        hasEnded: false,
        hasNotBegin: false
      }}
      currencyCode="USD"
    />
  ));

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
