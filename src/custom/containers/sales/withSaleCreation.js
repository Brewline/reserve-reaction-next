import React from "react";
import PropTypes from "prop-types";
import { Mutation /* , Query */, withApollo } from "react-apollo";
import { inject, observer } from "mobx-react";
import hoistNonReactStatic from "hoist-non-react-statics";
import withShop from "containers/shop/withShop";
import { createSaleForUntappdProduct } from "./mutations.gql";

/**
 * withSaleCreation higher order query component for creating, fetching, and updating carts
 * @name WithSaleCreation
 * @param {React.Component} Component to decorate
 * @returns {React.Component} - Component with `cart` props and callbacks
 */
export default function withSaleCreation(Component) {
  @withApollo
  @withShop
  @inject("cartStore", "authStore")
  @observer
  class WithSaleCreation extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        mutate: PropTypes.func.isRequired
      }),
      shop: PropTypes.shape({
        _id: PropTypes.string
      })
    }

    /**
     * @name handleChangeCartItemsQuantity
     * @summary Update the quantity of one or more cart items
     * @ignore
     * @param {Array<Object>|Object} cartItems An array of objects or a single object of shape: { cartItemId: String, quantity: Int }
     * @returns {undefined} No return
     */
    // untappdId: 3839,
    // saleData: {
    //   headline: "",
    //   beginsAt: "2019-03-01T06:00:00.000-05:00",
    //   endsAt: "2019-03-01T11:59:59.999-05:00"
    // },
    // variantOptionsData: [{
    //   title: "4-Pack (16oz. cans)",
    //   price: 13.99
    // }]
    handleCreateSaleForUntappdProduct = (formData, onSuccess, onFailure) => {
      const { client: apolloClient } = this.props;
      const { untappdId, saleData, variantOptionsData } = formData;

      apolloClient.mutate({
        mutation: createSaleForUntappdProduct,
        variables: {
          untappdId,
          saleData,
          variantOptionsData
        },
        onCompleted: onSuccess,
        onError: onFailure
      });
    }

    render() {
      return (
        <Mutation mutation={createSaleForUntappdProduct}>
          {(mutation, { data, loading, error }) => {
            const noop = () => {};
            const handleCreateSaleForUntappdProduct =
              (formData, onCompleted = noop, onError = noop) => (
                mutation({ variables: formData })
                  .then((response) => {
                    const {
                      data: { createSaleForUntappdProduct: sale } = {}
                    } = response;

                    return onCompleted(sale);
                  })
                  .catch(onError)
              );

            const { createSaleForUntappdProduct: sale } = data || {};
            return (
              <Component
                {...this.props}
                createError={error}
                createdSale={sale}
                isCreatingSale={loading}
                onCreateSaleForUntappdProduct={handleCreateSaleForUntappdProduct}
              />
            );
          }}
        </Mutation>
      );
    }
  }

  hoistNonReactStatic(WithSaleCreation, Component);

  return WithSaleCreation;
}
