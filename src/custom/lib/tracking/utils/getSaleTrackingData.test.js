import getSaleTrackingData from "./getSaleTrackingData";

const sale = {
  _id: "1234",
  sku: "a456",
  title: "My Sale",
  slug: "my-sale",
  vendor: "Reaction",
  tags: {
    nodes: [
      { name: "tag-1" },
      { name: "tag-2" }
    ]
  },
  shop: {
    currency: {
      code: "USD"
    }
  },
  pricing: [
    {
      currency: {
        code: "USD"
      },
      minPrice: 12.99,
      maxPrice: 19.99
    }
  ],
  primaryImage: {
    toGrid: 1,
    priority: 0,
    saleId: "1234",
    URLs: {
      original: "/assets/image.jpg"
    }
  }
};

test("getSaleTrackingData should return partial data for tracking with segment Sale schema", () => {
  const data = getSaleTrackingData(sale);

  const result = {
    sale_id: "1234", // eslint-disable-line camelcase
    sku: "a456",
    category: "tag-1",
    name: "My Sale",
    brand: "Reaction",
    currency: "USD",
    price: 12.99,
    quantity: 1,
    value: 12.99,
    image_url: "/assets/image.jpg", // eslint-disable-line camelcase
    url: "/sale/my-sale"
  };

  expect(data).toEqual(result);
});

test("getSaleTrackingData should not fail when tags.nodes is a blank array", () => {
  const saleDataWithoutTags = { ...sale };

  // When there are no tags, sale.tags.nodes may be a blank array
  saleDataWithoutTags.tags.nodes = [];

  const data = getSaleTrackingData(saleDataWithoutTags);

  const result = {
    sale_id: "1234", // eslint-disable-line camelcase
    sku: "a456",
    name: "My Sale",
    brand: "Reaction",
    currency: "USD",
    price: 12.99,
    quantity: 1,
    value: 12.99,
    image_url: "/assets/image.jpg", // eslint-disable-line camelcase
    url: "/sale/my-sale"
  };

  expect(data).toEqual(result);
});

