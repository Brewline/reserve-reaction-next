import moment from "moment";
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import { inject, observer } from "mobx-react";
import InlineAlert from "@reactioncommerce/components/InlineAlert/v1";
import track from "lib/tracking/track";
// import Breadcrumbs from "components/Breadcrumbs";
// import SaleDetailAddToCart from "components/SaleDetailAddToCart";
import ProductDetailTitle from "components/ProductDetailTitle";
// import VariantList from "components/VariantList";
import ProductDetailVendor from "components/ProductDetailVendor";
import ProductDetailDescription from "components/ProductDetailDescription";
// import SaleDetailPrice from "components/SaleDetailPrice";
// import MediaGallery from "components/MediaGallery";
import { Router } from "routes";
// import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
// import variantById from "lib/utils/variantById";
// import trackSale from "lib/tracking/trackSale";
import TRACKING from "lib/tracking/constants";
import trackCartItems from "lib/tracking/trackCartItems";
import SaleProductGrid from "./SaleProductGrid";
import SaleProductGridItem from "./SaleProductGridItem";

const { PRODUCT_VIEWED } = TRACKING;

const styles = (theme) => ({
  section: {
    marginBottom: theme.spacing.unit * 2
  },
  breadcrumbGrid: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  info: {
    marginBottom: theme.spacing.unit
  },
  notFoundMessage: {
    color: theme.palette.reaction.black65
  }
});

/**
 * Sale detail component
 * @name SaleDetail
 * @param {Object} props Component props
 * @returns {React.Component} React component node that represents a sale detail view
 */
@withWidth({ initialWidth: "md" })
@withStyles(styles, { withTheme: true, name: "SkSaleDetail" })
@inject("routingStore", "uiStore")
@track()
@observer
class SaleDetail extends Component {
  static propTypes = {
    /**
     * Function to add items to a cart.
     * Implementation may be provided by addItemsToCart function from the @withCart decorator
     *
     * @example addItemsToCart(CartItemInput)
     * @type Function
     */
    addItemsToCart: PropTypes.func,
    classes: PropTypes.object,
    currencyCode: PropTypes.string.isRequired,
    initialSize: PropTypes.object,
    routingStore: PropTypes.object.isRequired,
    sale: PropTypes.object,
    shop: PropTypes.object.isRequired,
    theme: PropTypes.object,
    uiStore: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired
  };

  selectVariant(variant, optionId) {
    const { sale, uiStore } = this.props;

    // Select the variant, and if it has options, the first option
    const variantId = variant._id;
    let selectOptionId = optionId;
    if (!selectOptionId && variant.options && variant.options.length) {
      selectOptionId = variant.options[0]._id;
    }

    this.trackAction({ variant, optionId, action: PRODUCT_VIEWED });

    uiStore.setPDPSelectedVariantId(variantId, selectOptionId);

    Router.pushRoute("sale", {
      slugOrId: sale.slug,
      variantId: selectOptionId || variantId
    }, { replace: true });
  }

  // @trackSale()
  trackAction() {}

  @trackCartItems()
  trackCartItems() {}

  /**
   * @name handleSelectVariant
   * @summary Called when a variant is selected in the variant list
   * @private
   * @ignore
   * @param {Object} variant The variant object that was selected
   * @returns {undefined} No return
   */
  handleSelectVariant = (variant) => {
    this.selectVariant(variant);
  };

  // /**
  //  * @name handleAddToCartClick
  //  * @summary Called when the add to cart button is clicked
  //  * @private
  //  * @ignore
  //  * @param {Number} quantity - A positive integer from 0 to infinity, representing the quantity to add to cart
  //  * @returns {undefined} No return
  //  */
  // handleAddToCartClick = async (quantity) => {
  //   const {
  //     addItemsToCart,
  //     currencyCode,
  //     sale,
  //     uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId },
  //     width
  //   } = this.props;

  //   // Get selected variant or variant option
  //   const selectedVariant = variantById(sale.variants, pdpSelectedVariantId);
  //   const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
  //   const selectedVariantOrOption = selectedOption || selectedVariant;

  //   if (selectedVariantOrOption) {
  //     // Get the price for the currently selected variant or variant option
  //     const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);

  //     // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
  //     const { data } = await addItemsToCart([
  //       {
  //         price: {
  //           amount: price.price,
  //           currencyCode
  //         },
  //         saleConfiguration: {
  //           saleId: sale.saleId, // Pass the saleId, not to be confused with _id
  //           saleVariantId: selectedVariantOrOption.variantId // Pass the variantId, not to be confused with _id
  //         },
  //         quantity
  //       }
  //     ]);

  //     // If no errors occurred, track action
  //     if (data) {
  //       // The response data will be in either `createCart` or `addCartItems` prop
  //       // depending on the type of user, either authenticated or anonymous.
  //       const { cart } = data.createCart || data.addCartItems;
  //       const { edges: items } = cart.items;

  //       this.trackAction({
  //         variant: {
  //           ...selectedVariant,
  //           cart_id: cart._id, // eslint-disable-line camelcase
  //           quantity
  //         },
  //         optionId: selectedOption ? selectedOption._id : null,
  //         action: PRODUCT_ADDED
  //       });

  //       // The mini cart popper will open automatically after adding an item to the cart,
  //       // therefore, a CART_VIEWED event is published.
  //       // debugger // eslint-disable-line
  //       this.trackCartItems({ cartItems: items, cartId: cart._id, action: CART_VIEWED }); // eslint-disable-line camelcase
  //     }
  //   }
  //   if (isWidthUp("md", width)) {
  //     // Open the cart, and close after a 3 second delay
  //     openCartWithTimeout(3000);
  //   }
  // };

  /**
   * @name handleSelectOption
   * @summary Called when an option is selected in the option list
   * @private
   * @ignore
   * @param {Object} option The option object that was selected
   * @returns {undefined} No return
   */
  handleSelectOption = (option) => {
    const { sale, uiStore } = this.props;

    // If we are clicking an option, it must be for the current selected variant
    const variant = sale.variants.find((vnt) => vnt._id === uiStore.pdpSelectedVariantId);

    this.selectVariant(variant, option._id);
  };

  // /**
  //  * @name determineSalePrice
  //  * @description Determines a sale's price given the shop's currency code. It will
  //  * use the selected option if available, otherwise it will use the selected variant.
  //  * @returns {Object} An pricing object
  //  */
  // determineSalePrice() {
  //   const { currencyCode, sale } = this.props;
  //   const { pdpSelectedVariantId, pdpSelectedOptionId } = this.props.uiStore;
  //   const selectedVariant = variantById(sale.variants, pdpSelectedVariantId);
  //   let salePrice = {};

  //   if (pdpSelectedOptionId && selectedVariant) {
  //     const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
  //     salePrice = priceByCurrencyCode(currencyCode, selectedOption.pricing);
  //   } else if (!pdpSelectedOptionId && selectedVariant) {
  //     salePrice = priceByCurrencyCode(currencyCode, selectedVariant.pricing);
  //   }

  //   return salePrice;
  // }
  renderTiming() {
    const { sale } = this.props;

    if (sale.hasNotBegun) {
      return (
        <InlineAlert
          alertType="information"
          message={`Begins ${moment(sale.beginsAt).fromNow()}`}
          title="This Can Release has not started"
        />
      );
    }

    if (sale.hasEnded) {
      return (
        <InlineAlert
          alertType="error"
          message={`Ended ${moment(sale.endsAt).fromNow()}`}
          title="This Can Release has ended"
        />
      );
    }

    if (sale.isLowQuantity) {
      return (
        <InlineAlert
          alertType="warning"
          message="Some products have limited availability"
          title="This Can Release is on fire!"
        />
      );
    }

    if (sale.isBackorder) {
      return (
        <InlineAlert
          alertType="error"
          message="Subscribe now to be notified of the next release"
          title="Backorder"
        />
      );
    }

    if (sale.isSoldOut) {
      return (
        <InlineAlert
          alertType="error"
          message="Subscribe now to be notified of the next release"
          title="Sold Out"
        />
      );
    }

    return (
      <InlineAlert
        alertType="warning"
        message={`Sale ends ${moment(sale.endsAt).fromNow()}`}
      />
    );
  }

  renderEmptyGrid() {
    const { classes } = this.props;

    return (
      <Typography className={classes.notFoundMessage} paragraph>
        No products found for this sale.
      </Typography>
    );
  }

  renderProducts() {
    const { sale: { products = [] }, initialSize } = this.props;

    if (products.length === 0) return this.renderEmptyGrid();

    return (
      <Fragment>
        <Grid container spacing={24}>
          <SaleProductGrid
            components={{ SaleProductGridItem }}
            initialSize={initialSize}
            onItemClick={this.onItemClick}
            products={products}
            placeholderImageURL="/static/images/placeholder.gif"
          />
          {/* ...this.props */}
        </Grid>
      </Fragment>
    );
  }

  renderDemoWarning() {
    const {
      sale: {
        isDemo,
        slug: saleSlug,
        shop: { name: shopName, slug: shopSlug } = {}
      } = {}
    } = this.props;

    if (!isDemo) { return; }

    const href =
      `https://www.brewline.io/contact/?utm_source=reserve&utm_medium=shop_sale&utm_campaign=brewer_onboarding&utm_term=${shopSlug}&utm_content=${saleSlug}`;
    const message = (
      <span>
        {`If you represent ${shopName} and would like to run your next can release online, please `}
        <a href={href} target="_blank">contact us</a>!
      </span>
    );

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <InlineAlert
            alertType="error"
            message={message}
            title="This is a demo can release"
          />
        </Grid>
      </Grid>
    );
  }

  render() {
    const {
      classes,
      sale,
      theme,
      width
    } = this.props;
    const pageTitle = null; // placeholder

    // // Set the default media as the top-level sale's media
    // // (all media on all variants and objects)
    // let pdpMediaItems = sale.media;

    // // If we have a selected variant (we always should)
    // // check to see if media is available, and use this media instead
    // // Revert to original media if variant doesn't have specific media
    // const selectedVariant = sale.variants.find((variant) => variant._id === pdpSelectedVariantId);
    // if (selectedVariant) {
    //   if (selectedVariant.media && selectedVariant.media.length) {
    //     pdpMediaItems = selectedVariant.media;
    //   }

    //   // If we have a selected option, do the same check
    //   // Will revert to variant check if no option media is available
    //   if (Array.isArray(selectedVariant.options) && selectedVariant.options.length) {
    //     const selectedOption = selectedVariant.options.find((option) => option._id === pdpSelectedOptionId);
    //     if (selectedOption) {
    //       if (selectedOption.media && selectedOption.media.length) {
    //         pdpMediaItems = selectedOption.media;
    //       }
    //     }
    //   }
    // }

    // const salePrice = this.determineSalePrice();
    // const compareAtDisplayPrice = (salePrice.compareAtPrice && salePrice.compareAtPrice.displayAmount) || null;

    // Phone size
    if (isWidthDown("sm", width)) {
      return (
        <Fragment>
          {this.renderDemoWarning()}

          <div className={classes.section}>
            <ProductDetailTitle pageTitle={pageTitle} title={sale.headline} />

            <div className={classes.info}>
              <ProductDetailVendor>{sale.shop.name}</ProductDetailVendor>
            </div>

            {this.renderTiming()}
            {/*
            <div className={classes.info}>
              <SaleDetailPrice compareAtPrice={compareAtDisplayPrice} isCompact price={salePrice.displayPrice} />
            </div>
            */}
          </div>

          {/*
          <div className={classes.section}>
            <MediaGallery mediaItems={pdpMediaItems} />
          </div>
          */}

          {this.renderProducts()}

          <div className={classes.section}>
            <ProductDetailDescription>{sale.description}</ProductDetailDescription>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        {this.renderDemoWarning()}

        <Grid container spacing={theme.spacing.unit * 5}>
          {/* <Grid item className={classes.breadcrumbGrid} xs={12}>
            <Breadcrumbs isPDP tagId={routingStore.tagId} sale={sale} />
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <div className={classes.section}>
              <MediaGallery mediaItems={pdpMediaItems} />
            </div>
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <ProductDetailTitle pageTitle={pageTitle} title={sale.headline} />

            <div className={classes.info}>
              <ProductDetailVendor>{sale.shop.name}</ProductDetailVendor>
            </div>

            {this.renderTiming()}

            {/* <div className={classes.info}>
              <SaleDetailPrice className={classes.bottomMargin} compareAtPrice={compareAtDisplayPrice} price={salePrice.displayPrice} />
            </div> */}

            <div className={classes.info}>
              <ProductDetailDescription>{sale.description}</ProductDetailDescription>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            {this.renderProducts()}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default SaleDetail;
