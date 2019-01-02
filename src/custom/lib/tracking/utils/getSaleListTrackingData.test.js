import getSaleListTrackingData from "./getSaleListTrackingData";

const tag = {
  _id: "tag123",
  name: "My Tag"
};

const sales = [{
  _id: "1234",
  sku: "a456",
  title: "My Sale",
  vendor: "Reaction",
  slug: "my-sale",
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
}];

test("getSaleListTrackingData should return data for tracking with segment Sale List schema", () => {
  const data = getSaleListTrackingData({ tag, sales });

  const result = {
    list_id: "tag123", // eslint-disable-line camelcase
    category: "My Tag",
    sales: [
      {
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
      }
    ]
  };

  expect(data).toEqual(result);
});
