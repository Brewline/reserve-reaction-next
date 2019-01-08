// forked from: https://raw.githubusercontent.com/reactioncommerce/reaction-component-library/c0610e8c1048d6305eacb5262cdd13985d892a89/package/src/components/CatalogGridItem/v1/CatalogGridItem.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import {
  addTypographyStyles,
  applyTheme,
  CustomPropTypes,
  preventAccidentalDoubleClick
} from "@reactioncommerce/components/utils";
import { priceByCurrencyCode } from "@reactioncommerce/components/CatalogGridItem/v1/utils";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import withCart from "containers/cart/withCart";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";
import VariantList from "components/VariantList";
import TRACKING from "lib/tracking/constants";
import track from "lib/tracking/track";
import trackCartItems from "lib/tracking/trackCartItems";
import trackProduct from "lib/tracking/trackProduct";
import variantById from "lib/utils/variantById";

const { CART_VIEWED, PRODUCT_ADDED, PRODUCT_VIEWED } = TRACKING;

const ProductMediaWrapper = styled.div`
  background-color: ${applyTheme("CatalogGridItem.mediaBackgroundColor")};
  position: relative;
`;

const ProductInfo = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: ${applyTheme("CatalogGridItem.verticalSpacingBetweenImageAndInfo")};
`;

const ProductTitle = styled.aside`
  ${addTypographyStyles("CatalogGridItemProductTitle", "headingTextBold")}
  line-height: 1.125;
`;

const ProductVendor = styled.span`
  ${addTypographyStyles("CatalogGridItemProductVendor", "labelText")}
`;

const PriceContainer = styled.div`
  text-align: right;
`;

@withCart
@withWidth({ initialWidth: "md" })
@inject("routingStore", "uiStore")
@track()
@observer
class SaleProductGridItem extends Component {
  static propTypes = {
    /**
     * Function to add items to a cart.
     * Implementation may be provided by addItemsToCart function from the @withCart decorator
     *
     * @example addItemsToCart(CartItemInput)
     * @type Function
     */
    addItemsToCart: PropTypes.func,
    /**
     * Labels to use for the various badges. Refer to `BadgeOverlay`'s prop documentation.
     */
    badgeLabels: PropTypes.shape({
      BACKORDER: PropTypes.string,
      BESTSELLER: PropTypes.string,
      LOW_QUANTITY: PropTypes.string,
      SOLD_OUT: PropTypes.string,
      SALE: PropTypes.string
    }),
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using
     * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      BadgeOverlay: CustomPropTypes.component.isRequired,
      Link: CustomPropTypes.component.isRequired,
      Price: CustomPropTypes.component.isRequired,
      ProgressiveImage: CustomPropTypes.component.isRequired
    }),
    /**
     * Currency code to display the price for. Product must include a pricing object with the code in `product.pricing`
     */
    currencyCode: PropTypes.string.isRequired,
    /**
     * Item click handler
     */
    onClick: PropTypes.func,
    /**
     * Image to display when product doesn't have a primary image
     */
    placeholderImageURL: PropTypes.string,
    /**
     * Product to display
     */
    product: PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      vendor: PropTypes.string,
      primaryImage: PropTypes.shape({
        URLs: PropTypes.shape({
          large: PropTypes.string,
          medium: PropTypes.string,
          small: PropTypes.string,
          thumbnail: PropTypes.string
        })
      }),
      pricing: PropTypes.arrayOf(PropTypes.shape({
        currency: PropTypes.shape({
          code: PropTypes.string
        }),
        displayPrice: PropTypes.string
      })),
      isSoldOut: PropTypes.bool,
      isBackorder: PropTypes.bool,
      isOnSale: PropTypes.bool,
      isLowQuantity: PropTypes.bool,
      isBestseller: PropTypes.bool
    }),
    uiStore: PropTypes.object.isRequired
  };

  static defaultProps = {
    badgeLabels: null,
    onClick() {},
    placeholderImageURL: ""
  };

  state = {
    fit: "cover"
  };

  componentDidMount() {
    const { product } = this.props;

    this._mounted = true;

    this.setImageFit();

    // Select first variant by default
    this.selectVariant(product.variants[0], null, false);
  }

  componentDidUpdate() {
    this.setImageFit();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  setImageFit = () => {
    // Use cover fit if image is landscape, contain if portrait
    if (typeof Image !== "undefined") {
      const { large } = this.primaryImage.URLs;
      const largeImage = new Image();
      largeImage.src = large;
      largeImage.onload = () => {
        if (this._mounted === false) {
          return;
        }

        let fit = "";
        const { width, height } = largeImage;
        if (height > width) {
          // Image is portrait
          fit = "contain";
        } else {
          // Image is landscape
          fit = "cover";
        }

        if (fit !== this.state.fit) {
          this.setState({ fit });
        }
      };
    }
  };

  get productDetailHref() {
    const { product: { slug } } = this.props;
    const url = `/product/${slug}`;
    return url;
  }

  get primaryImage() {
    const { product: { primaryImage }, placeholderImageURL } = this.props;
    if (!primaryImage) {
      return {
        URLs: {
          thumbnail: placeholderImageURL,
          small: placeholderImageURL,
          medium: placeholderImageURL,
          large: placeholderImageURL
        }
      };
    }
    return primaryImage;
  }

  @trackProduct()
  trackAction() {}

  @trackCartItems()
  trackCartItems() {}

  selectVariant(variant, optionId, trackAction = true) {
    const { uiStore } = this.props;

    // Select the variant, and if it has options, the first option
    const variantId = variant._id;
    let selectOptionId = optionId;
    if (!selectOptionId && variant.options && variant.options.length) {
      selectOptionId = variant.options[0]._id;
    }

    if (trackAction) {
      this.trackAction({ variant, optionId, action: PRODUCT_VIEWED });
    }

    uiStore.setPDPSelectedVariantId(variantId, selectOptionId);
  }

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

  /**
   * @name handleSelectOption
   * @summary Called when an option is selected in the option list
   * @private
   * @ignore
   * @param {Object} option The option object that was selected
   * @returns {undefined} No return
   */
  handleSelectOption = (option) => {
    const { product, uiStore } = this.props;

    // If we are clicking an option, it must be for the current selected variant
    const variant = product.variants.find((vnt) => vnt._id === uiStore.pdpSelectedVariantId);

    this.selectVariant(variant, option._id);
  };

  handleOnClick = preventAccidentalDoubleClick((event) => {
    this.props.onClick(event, this.props.product);
  });

  /**
   * @name handleAddToCartClick
   * @summary Called when the add to cart button is clicked
   * @private
   * @ignore
   * @param {Number} quantity - A positive integer from 0 to infinity, representing the quantity to add to cart
   * @returns {undefined} No return
   */
  handleAddToCartClick = async (quantity) => {
    const {
      addItemsToCart,
      currencyCode,
      product,
      uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId },
      width
    } = this.props;

    // Get selected variant or variant option
    const selectedVariant = variantById(product.variants, pdpSelectedVariantId);
    const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
    const selectedVariantOrOption = selectedOption || selectedVariant;

    debugger;
    if (selectedVariantOrOption) {
      // Get the price for the currently selected variant or variant option
      const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);

      // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
      const { data } = await addItemsToCart([
        {
          price: {
            amount: price.price,
            currencyCode
          },
          productConfiguration: {
            productId: product.productId, // Pass the productId, not to be confused with _id
            productVariantId: selectedVariantOrOption.variantId // Pass the variantId, not to be confused with _id
          },
          quantity
        }
      ]);

      // If no errors occurred, track action
      if (data) {
        // The response data will be in either `createCart` or `addCartItems` prop
        // depending on the type of user, either authenticated or anonymous.
        const { cart } = data.createCart || data.addCartItems;
        const { edges: items } = cart.items;

        this.trackAction({
          variant: {
            ...selectedVariant,
            cart_id: cart._id, // eslint-disable-line camelcase
            quantity
          },
          optionId: selectedOption ? selectedOption._id : null,
          action: PRODUCT_ADDED
        });

        // The mini cart popper will open automatically after adding an item to the cart,
        // therefore, a CART_VIEWED event is published.
        // debugger // eslint-disable-line
        this.trackCartItems({ cartItems: items, cartId: cart._id, action: CART_VIEWED }); // eslint-disable-line camelcase
      }
    }
    if (isWidthUp("md", width)) {
      // Open the cart, and close after a 3 second delay
      openCartWithTimeout(3000);
    }
  };

  renderProductMedia() {
    const { components: { ProgressiveImage }, product: { description } } = this.props;
    const { fit } = this.state;

    return (
      <ProductMediaWrapper>
        <ProgressiveImage
          fit={fit}
          altText={description}
          presrc={this.primaryImage.URLs.thumbnail}
          srcs={this.primaryImage.URLs}
        />
      </ProductMediaWrapper>
    );
  }

  renderProductInfo() {
    const {
      components: { Price },
      currencyCode,
      product
    } = this.props;
    const { pageTitle, pricing, title } = product;
    const productPrice = priceByCurrencyCode(currencyCode, pricing) || {};

    return (
      <div>
        <ProductInfo>
          <ProductTitle>{title}</ProductTitle>
          <PriceContainer>
            <Price displayPrice={productPrice.displayPrice} />
          </PriceContainer>
        </ProductInfo>
        <div>
          <ProductVendor>{pageTitle}</ProductVendor>
        </div>
      </div>
    );
  }

  renderAddToCart() {
    const {
      currencyCode,
      product,
      uiStore: { pdpSelectedOptionId, pdpSelectedVariantId }
    } = this.props;
    const { variants } = product;

    return (
      <div>
        <VariantList
          onSelectOption={this.handleSelectOption}
          onSelectVariant={this.handleSelectVariant}
          product={product}
          selectedOptionId={pdpSelectedOptionId}
          selectedVariantId={pdpSelectedVariantId}
          currencyCode={currencyCode}
          variants={variants}
        />
        <ProductDetailAddToCart onClick={this.handleAddToCartClick} />
      </div>
    );
  }

  render() {
    const {
      className,
      badgeLabels,
      components: { BadgeOverlay /* , Link */ },
      product
    } = this.props;

    const badgeProps = { product };

    if (badgeLabels) {
      badgeProps.badgeLabels = badgeLabels;
    }

    return (
      <div className={className}>
        {/* Sale Product Detail Page is not yet supported
          <Link
            href={this.productDetailHref}
            onClick={this.handleOnClick}
          >
        */}
        <BadgeOverlay {...badgeProps}>
          {this.renderProductMedia()}
          {this.renderProductInfo()}
        </BadgeOverlay>
        {/*
          </Link>
        */}
        {this.renderAddToCart()}
      </div>
    );
  }
}

export default withComponents(SaleProductGridItem);
