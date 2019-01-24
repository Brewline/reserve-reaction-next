// Seeded with: https://raw.githubusercontent.com/reactioncommerce/reaction-component-library/c0610e8c1048d6305eacb5262cdd13985d892a89/package/src/components/CatalogGridItem/v1/CatalogGridItem.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import {
  addTypographyStyles,
  applyTheme,
  CustomPropTypes,
  preventAccidentalDoubleClick
} from "@reactioncommerce/components/utils";

const ProductMediaWrapper = styled.div`
  background-color: ${applyTheme("CatalogGridItem.mediaBackgroundColor")};
  position: relative;
`;

const SaleInfo = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: ${applyTheme("CatalogGridItem.verticalSpacingBetweenImageAndInfo")};
`;

const SaleTitle = styled.aside`
  ${addTypographyStyles("CatalogGridItemProductTitle", "headingTextBold")}
  line-height: 1.125;
`;

const SaleVendor = styled.span`
  ${addTypographyStyles("CatalogGridItemProductVendor", "labelText")}
`;

class SaleGridItem extends Component {
  static propTypes = {
    /**
     * Labels to use for the various badges. Refer to `BadgeOverlay`'s prop documentation.
     */
    badgeLabels: PropTypes.shape({
      BACKORDER: PropTypes.string,
      HAS_ENDED: PropTypes.string,
      LOW_QUANTITY: PropTypes.string,
      PRE_SALE: PropTypes.string,
      SOLD_OUT: PropTypes.string
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
      ProgressiveImage: CustomPropTypes.component.isRequired
    }),
    /**
     * Item click handler
     */
    onClick: PropTypes.func,
    /**
     * Image to display when sale doesn't have a primary image
     */
    placeholderImageURL: PropTypes.string,
    /**
     * Product to display
     */
    sale: PropTypes.shape({
      headline: PropTypes.string,
      slug: PropTypes.string,
      primaryImage: PropTypes.shape({
        URLs: PropTypes.shape({
          large: PropTypes.string,
          medium: PropTypes.string,
          small: PropTypes.string,
          thumbnail: PropTypes.string
        })
      }),
      isSoldOut: PropTypes.bool,
      isBackorder: PropTypes.bool,
      isLowQuantity: PropTypes.bool,
      hasEnded: PropTypes.bool,
      hasNotBegin: PropTypes.bool
    })
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
    this._mounted = true;

    this.setImageFit();
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

  get saleDetailHref() {
    const { sale: { slug } } = this.props;
    const url = `/can-release/${slug}`; // TODO: use router
    return url;
  }

  get primaryImage() {
    const { sale: { primaryImage }, placeholderImageURL } = this.props;
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

  handleOnClick = preventAccidentalDoubleClick((event) => {
    this.props.onClick(event, this.props.sale);
  });

  renderProductMedia() {
    const { components: { ProgressiveImage }, sale: { description } } = this.props;
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
      sale: { headline, shop: { name: vendor } = {} }
    } = this.props;

    return (
      <div>
        <SaleInfo>
          <SaleTitle>{headline}</SaleTitle>
        </SaleInfo>
        <div>
          <SaleVendor>{vendor}</SaleVendor>
        </div>
      </div>
    );
  }

  render() {
    const { className, badgeLabels, components: { BadgeOverlay, Link }, sale } = this.props;

    // TODO: create a sale-specific BadgeOverlay
    const badgeProps = { product: sale };

    if (badgeLabels) {
      badgeProps.badgeLabels = badgeLabels;
    }

    return (
      <div className={className}>
        <Link
          href={this.saleDetailHref}
          onClick={this.handleOnClick}
        >
          <BadgeOverlay {...badgeProps}>
            {this.renderProductMedia()}
            {this.renderProductInfo()}
          </BadgeOverlay>
        </Link>
      </div>
    );
  }
}

export default withComponents(SaleGridItem);
