const featuresIconSize = 60; // measured

export function styles(theme) {
  const horizontalSpacing = theme.spacing.unit * 3;

  return {
    "backLink": {
      "color": theme.palette.reaction.black80,
      "cursor": "pointer",
      "fontFamily": theme.typography.fontFamily,
      "fontSize": 14,
      "&:hover": {
        color: theme.palette.reaction.reactionBlue400
      }
    },

    "backLinkText": {
      letterSpacing: "0.3px",
      lineHeight: 1.71,
      marginLeft: theme.spacing.unit,
      textDecoration: "underline"
    },

    "ctaButtonWrapper": {
      width: "100%"
    },

    "featuresSection": {
      "backgroundColor": theme.palette.reaction.black80,

      "& h2, & h4, & p": {
        color: theme.palette.reaction.white
      }
    },

    "featuresContent": {
      flex: "1 1 auto",
      maxWidth: theme.layout.mainLoginMaxWidth,
      margin: "0 auto",
      padding: `${horizontalSpacing}px`
    },

    "featuresTitle": {
      color: theme.palette.reaction.white,
      textAlign: "center",
      marginBottom: theme.spacing.unit * 4
    },

    "feature": {
      alignItems: "center",
      backgroundColor: theme.palette.reaction.black70,
      display: "flex",
      height: "100%",
      justifyContent: "center",
      flexDirection: "column",
      width: "100%"
    },

    "featureCard": {
      margin: `0 ${theme.spacing.unit}px ${theme.spacing.unit * 4}px`
    },

    "featureGridItem": {
      display: "flex"
    },

    "featureIcon": {
      backgroundColor: theme.palette.reaction.white,
      borderRadius: "100%",
      color: theme.palette.brewline.brewlineBlue,
      fontSize: featuresIconSize,
      height: theme.spacing.unit * 4 + featuresIconSize,
      marginBottom: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
      width: theme.spacing.unit * 4 + featuresIconSize
    },

    "headerFlex": {
      alignSelf: "center",
      flex: "1 1 1%"
    },

    "header": {
      alignContent: "center",
      borderBottom: `solid 1px ${theme.palette.reaction.black10}`,
      display: "flex",
      justifyContent: "center",
      marginBottom: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 3
    },

    "hero": {
      "color": theme.palette.background.default, // theme.palette.text.inverted
      "flex": "1 1 auto",
      "maxWidth": theme.layout.mainLoginMaxWidth,
      // "minHeight": "calc(100vh - 135px)",
      "margin": "0 auto",
      "padding": `${theme.spacing.unit * 3}px ${horizontalSpacing}px`,

      [theme.breakpoints.up("md")]: {
        paddingBottom: `${theme.spacing.unit * 10}px`,
        paddingTop: `${theme.spacing.unit * 10}px`
      },

      "& h1, & h2, & p": {
        color: theme.palette.background.default
      }
    },

    "heroTitle": {
      textAlign: "center"
    },

    "heroCta": {
      marginTop: theme.spacing.unit * 3,
      textAlign: "center"
    },

    "logo": {
      color: theme.palette.reaction.reactionBlue,
      margin: "auto",
      borderBottom: `solid 5px ${theme.palette.reaction.reactionBlue200}`
    },

    "main": {
      flex: "1 1 auto",
      // maxWidth: theme.layout.mainLoginMaxWidth,
      maxWidth: "100%",
      minHeight: "calc(100vh - 135px)",
      margin: "0 auto",
      padding: 0,
      [theme.breakpoints.up("md")]: {
        padding: 0
      }
    },

    "root": {},

    "secondaryCtaSection": {
      backgroundColor: theme.palette.reaction.black05
    },

    "secondaryCtaContent": {
      "alignItems": "center",
      "display": "flex",
      "flex": "1 1 auto",
      "flexDirection": "column",
      "justifyContent": "center",
      "maxWidth": theme.layout.mainLoginMaxWidth,
      "margin": "0 auto",
      "padding": `${horizontalSpacing}px`,
      "textAlign": "center",

      [theme.breakpoints.up("md")]: {
        flexDirection: "row"
      },

      "& > *": {
        margin: `0 ${theme.spacing.unit}px`
      }
    },

    "@global": {
      "body": {
        color: theme.palette.background.default, // theme.palette.text.inverted
        backgroundColor: `${theme.palette.brewline.brewlineBlue} !important`,
        [theme.breakpoints.up("md")]: {
          backgroundAttachment: "fixed",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: "url('/static/images/canning-line.jpg')"
        }
      },

      "header + main > article": {
        padding: "0 !important"
      }
    }
  };
}
