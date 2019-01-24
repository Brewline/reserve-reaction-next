import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes, preventAccidentalDoubleClick } from "@reactioncommerce/components/utils";

const GridContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const GridItem = styled.div`
  box-sizing: border-box;
  flex-basis: 100%;
  flex-grow: 0;
  margin: 0;
  max-width: 100%;
  padding: 12px;
`;

class SaleProductGrid extends Component {
  static propTypes = {
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
      SaleProductGridItem: CustomPropTypes.component.isRequired
    }).isRequired,
    /**
     * Currency code to display the price for. Product must include a pricing object with the code in `product.pricing`
     */
    currencyCode: PropTypes.string,
    /**
     * Item click handler
     */
    onItemClick: PropTypes.func,
    /**
     * Image to display when product doesn't have a primary image
     */
    placeholderImageURL: PropTypes.string,
    /**
     * Products to display in the grid. Refer to `SaleProductGridItem`'s documentation
     */
    products: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    badgeLabels: null,
    currencyCode: "USD",
    initialSize: {
      width: 325
    },
    onItemClick() {},
    placeholderImageURL: "/resources/placeholder.gif",
    products: []
  };

  handleOnClick = preventAccidentalDoubleClick((event, product) => {
    this.props.onItemClick(event, product);
  });

  render() {
    const {
      badgeLabels,
      className,
      components: { SaleProductGridItem },
      currencyCode,
      onItemClick,
      placeholderImageURL,
      products
    } = this.props;

    const gridItemProps = {
      currencyCode,
      placeholderImageURL,
      onClick: onItemClick
    };

    if (badgeLabels) {
      gridItemProps.badgeLabels = badgeLabels;
    }

    return (
      <GridContainer className={className}>
        {products.map((product, index) => (
          <GridItem key={`grid-item-${index}`} {...this.props}>
            <SaleProductGridItem product={product} {...gridItemProps} />
          </GridItem>
        ))}
      </GridContainer>
    );
  }
}

export default withComponents(SaleProductGrid);
