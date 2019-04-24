import React, { Component, Fragment } from "react";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FilledInput from "@material-ui/core/FilledInput";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconUntappd from "mdi-material-ui/Untappd";

import { Router } from "routes";

import UntappdSearchResults from "custom/components/UntappdSearchResults/UntappdSearchResults";
import UntappdBeerSearchResult from "custom/components/UntappdSearchResults/Beer";
import withSaleCreation from "custom/containers/sales/withSaleCreation";
import withUntappdProductSearch from "custom/containers/untappd/withUntappdProductSearch";
import SaleGridItem from "../../components/SaleGrid/SaleGridItem";

const defaultPrice = 13;
const SERVING_OPTIONS = {
  "four-pack-cans": "4-Pack (16 oz cans)",
  "six-pack-cans": "6-Pack (12 oz cans)",
  "seven-fifty": "Bottle (750 ml)",
  "other": "Other"
};

const styles = (theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    flex: "1 1 auto",
    // maxWidth: theme.layout.mainLoginMaxWidth,
    maxWidth: "100%",
    margin: "0 auto",
    padding: theme.spacing.unit * 2
  },
  fullWidth: {
    width: "100%"
  },
  inline: {
    display: "inline"
  }
});

function thisFridayAsString() {
  const dt = new Date();
  // jump ahead to Friday
  dt.setDate(dt.getDate() + ((12 - dt.getDay()) % 7)); // 12 would be 5 (Friday), but the JS % operator can return negative numbers, which we don't want here.

  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);

  return `${yyyy}-${mm}-${dd}`;
}

function getTzOffset() {
  const dt = new Date();
  const tz = dt.getTimezoneOffset();
  const op = tz > 0 ? "-" : "+"; // it's opposite
  const hh = `0${Math.floor(Math.abs(tz) / 60)}`.slice(-2);
  const mm = `0${tz % 60}`.slice(-2);

  return `${op}${hh}:${mm}`;
}

@withStyles(styles, { withTheme: true, name: "Onboarding" })
@withUntappdProductSearch
@withSaleCreation
export default class CanReleaseBuilder extends Component {
  static propTypes = {
    beerSearchResults: PropTypes.arrayOf(PropTypes.shape({
      beer: PropTypes.shape({
        /* eslint-disable camelcase */
        beer: PropTypes.shape({
          bid: PropTypes.number,
          beer_label: PropTypes.string,
          beer_name: PropTypes.string,
          beer_style: PropTypes.string
        }),
        brewery: PropTypes.shape({
          brewery_name: PropTypes.string
        })
        /* eslint-enable camelcase */
      })
    })),
    classes: PropTypes.object,
    createError: PropTypes.any, // not sure
    createdSale: PropTypes.object,
    isCreatingSale: PropTypes.bool,
    isSearchingBeer: PropTypes.bool,
    onBeerSearch: PropTypes.func,
    onCreateSaleForUntappdProduct: PropTypes.func
  };

  state = {
    servingSize: "four-pack-cans"
  };

  inputRefs = {};

  handleThrottledBeerSearch = debounce(this.props.onBeerSearch, 500);

  handleBeerSearch = (event) => {
    const { currentTarget: { value } } = event;

    return this.handleThrottledBeerSearch(value);
  }

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      return;
    }
  }

  handleChooseBeer = (selectedSearchResult) => {
    this.setState({ selectedSearchResult });
  }

  handleCreateCanRelease = (event) => {
    event.preventDefault(); // prevent form submission

    const formData = {};
    const {
      selectedSearchResult: { beer: { bid: untappdId } = {} } = {},
      servingSize
    } = this.state;

    const tzOffset = getTzOffset();

    // TODO: inflate formData
    formData.untappdId = untappdId;
    formData.saleData = {
      beginsAt: `${this.inputRefs.date.value}T00:00:00.000${tzOffset}`,
      endsAt: `${this.inputRefs.date.value}T23:59:59.000${tzOffset}`
    };
    formData.variantOptionsData = [{
      price: parseFloat(this.inputRefs.price.value),
      title: SERVING_OPTIONS[servingSize] || SERVING_OPTIONS.other // ,
      // optionTitle: servingSize
    }];

    this.props.onCreateSaleForUntappdProduct(formData, (sale) => {
      const {
        slug: saleSlugOrId,
        shop: { slug: shopSlugOrId } = {}
      } = sale;

      // TODO: GA tracking event

      Router.pushRoute("shopSaleDetail", {
        shopSlugOrId,
        saleSlugOrId,
        _poll: true
      });
    });

    return false; // prevent form submission (again)
  }

  getServingSizeLabel() {
    const { servingSize } = this.state;

    return SERVING_OPTIONS[servingSize] || "unit";
  }

  renderBeerPicker() {
    const { beerSearchResults, classes, isSearchingBeer } = this.props;

    const helperText = (
      <Fragment>
        Search powered by Untappd
        <IconUntappd fontSize="inherit" style={{ verticalAlign: "bottom" }} />
        {isSearchingBeer && <em>{" Loading..."}</em>}
      </Fragment>
    );

    return (
      <Fragment>
        <TextField
          id="beer-search"
          className={classes.textField}
          fullWidth
          helperText={helperText}
          inputRef={(input) => { this.inputRefs.beerSearch = input; }}
          label="Search for your beer by name"
          margin="normal"
          onChange={this.handleBeerSearch}
          onKeyDown={this.handleKeyDown}
          type="text"
          variant="filled"

          InputLabelProps={{
            shrink: true
          }}
        />

        <UntappdSearchResults
          ItemComponent={UntappdBeerSearchResult}
          className={classes.root}
          isLoading={isSearchingBeer}
          onClickItem={this.handleChooseBeer}
          searchResults={beerSearchResults}
        />
      </Fragment>
    );
  }

  renderChosenBeer() {
    const { classes } = this.props;
    const { selectedSearchResult } = this.state;

    return (
      <UntappdSearchResults
        ItemComponent={UntappdBeerSearchResult}
        avatarSizeClassName="avatarLarge"
        className={classes.root}
        searchResults={[selectedSearchResult]}
      />
    );
  }

  renderFormFields() {
    const { classes } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TextField
            id="date"
            className={classes.textField}
            defaultValue={thisFridayAsString()}
            fullWidth
            inputRef={(input) => { this.inputRefs.date = input; }}
            label="Release Date"
            margin="normal"
            type="date"
            variant="filled"

            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="price"
            className={classes.textField}
            defaultValue={defaultPrice}
            fullWidth
            helperText={`per ${this.getServingSizeLabel()}`}
            inputRef={(input) => { this.inputRefs.price = input; }}
            label="Cost"
            margin="normal"
            type="number"
            variant="filled"

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  variant="filled"
                >
                  $
                </InputAdornment>
              )
            }}

            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="filled" className={classes.fullWidth} margin="normal">
            <InputLabel htmlFor="filled-serving-simple">Serving</InputLabel>
            <Select
              onChange={(e) => { this.setState({ servingSize: e.target.value }); }}
              input={<FilledInput name="Serving" id="filled-serving-simple" />}
              value={this.state.servingSize}
            >
              {Object.keys(SERVING_OPTIONS).map((k) => (
                <MenuItem key={k} value={k}>{SERVING_OPTIONS[k]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }

  renderFormActions() {
    const { classes, isCreatingSale } = this.props;

    const buttonText =
      isCreatingSale ? "Creating demo sale..." : "Create demo can release";

    return (
      <Grid alignItems="flex-end" container>
        <Grid item xs={12} sm={3} />
        <Grid item xs={12} sm={6}>
          <Button
            color="primary"
            className={classes.button}
            disabled={isCreatingSale}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderCreatedSale() {
    const { createdSale } = this.props;

    return <SaleGridItem sale={createdSale} />;
  }

  renderForm() {
    const { classes } = this.props;
    const { selectedSearchResult } = this.state;
    const beerChosen = !!selectedSearchResult;

    return (
      <form
        className={classes.container}
        noValidate
        onSubmit={this.handleCreateCanRelease}
      >
        <Fragment>
          <Slide direction="down" in={!beerChosen} mountOnEnter unmountOnExit>
            {this.renderBeerPicker()}
          </Slide>

          <Slide direction="up" in={beerChosen} mountOnEnter unmountOnExit>
            <Fragment>
              {this.renderChosenBeer()}

              {this.renderFormFields()}

              {this.renderFormActions()}
            </Fragment>
          </Slide>
        </Fragment>
      </form>
    );
  }

  render() {
    let content;
    const { classes, createdSale } = this.props;

    if (createdSale && createdSale._id) {
      content = this.renderCreatedSale();
    } else {
      content = this.renderForm();
    }

    return (
      <Fragment>
        <Helmet
          title="Can Release Builder"
          meta={[{ name: "description", content: "Build your Craft Beer Can Release in seconds" }]}
        />
        <div className={classes.root}>
          <main className={classes.main}>
            <Typography
              className={classes.heroCta}
              component="h1"
              gutterBottom={true}
              variant="h6"
            >
              Ready to see your next beer release on Brewline?
            </Typography>

            {content}
          </main>
        </div>
      </Fragment>
    );
  }
}
