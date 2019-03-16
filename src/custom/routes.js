/**
 * @see https://www.npmjs.com/package/next-routes
 * @param {Object} routes The next-routes `routes` object.
 * @returns {undefined}
 */
function defineRoutes(routes) {
  routes
    // .add("home", "/", "productGrid") // #brewlinecustom
    .add("cart", "/cart", "cart")
    .add("checkout", "/cart/checkout", "checkout")
    .add("checkoutLogin", "/cart/login", "checkout")
    .add("checkoutComplete", "/checkout/order/:orderId", "checkoutComplete")
    .add("login", "/login", "login")
    .add("shopProduct", "/shop/:shopSlug/product/:slugOrId", "product")
    .add("product", "/product/:slugOrId/:variantId?", "product")
    .add("shop", "/shop/:shopId/:tag", "productGrid")
    .add("tag", "/tag/:slug", "tag")
    .add("profileAddressBook", "/profile/address", "profile")
    .add("profileOrders", "/profile/orders", "profile")
    .add("profilePaymentMethods", "/profile/payments", "profile");

  // #brewlinecustom
  routes
    .add("home", "/", "custom/home")
    .add("onboarding", "/welcome/:type?/:page?", "custom/onboarding")
    .add("saleProduct", "/can-releases/:slugOrId/:productSlugOrId", "custom/saleProduct")
    .add("sale", "/can-releases/:slugOrId", "custom/saleDetail")
    .add("sales", "/can-releases", "custom/saleGrid")

    // .add("shops", "/shops", "custom/shops")
    // .add("shopDetail", "/:shopSlugOrId", "custom/shopDetail")
    .add("shopSales", "/:shopSlugOrId/can-releases", "custom/shopSales")
    .add("shopSaleDetail", "/:shopSlugOrId/:saleSlugOrId", "custom/shopSaleDetail")
  ;
}

module.exports = defineRoutes;
