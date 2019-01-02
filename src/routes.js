const routes = require("next-routes")();
const getConfig = require("next/config").default;
const defineRoutes = require("./custom/routes");

if (process.browser) {
  const { publicRuntimeConfig } = getConfig();

  const wrap = (method) => (route, params, options = {}) => {
    const { byName, urls: { as, href } } = routes.findAndGetUrls(route, params);

    // Force full page loads
    if (!publicRuntimeConfig.enableSPARouting && !options.replace) {
      window.location = as;
      return as;
    }

    // History pushstate
    return routes.Router[method](href, as, byName ? options : params);
  };

  // Override router push methods
  routes.Router.pushRoute = wrap("push");
  routes.Router.replaceRoute = wrap("replace");
  routes.Router.prefetchRoute = wrap("prefetch");
}

defineRoutes(routes);

module.exports = routes;


// to replace routes, we need to remove them first (to avoid an error)
// clunky, sure, but trying to keep edits to Reaction source to a minimum
routes.replace = function (name, pattern, page) {
  const routeIndex = this.routes.findIndex((r) => r.name === name);

  if (routeIndex >= 0) {
    this.routes.splice(routeIndex, 1);
  }

  return this.add(name, pattern, page);
};

routes
  .replace("home", "/", "custom/root")
  .add("onboarding", "/welcome/:type?/:page?", "custom/onboarding")
  .add("saleProduct", "/can-release/:slugOrId/:productSlugOrId", "custom/saleProduct")
  .add("sale", "/can-release/:slugOrId", "custom/saleDetail")
  .add("sales", "/can-releases", "custom/saleGrid")
;
