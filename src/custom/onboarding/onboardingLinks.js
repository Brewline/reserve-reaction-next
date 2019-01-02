import Link from "components/Link";

export const typeBrewery = "brewery";
export const typeCustomer = "customer";

function generateOnboardingLink(type, page = "about") {
  const OnboardingLink = ({ children, classes, className }) => (
    <Link
      to="onboarding"
      params={{ type, page }}
      prefetch
      children={children}
      classes={classes}
      className={className}
    />
  );

  OnboardingLink.type = type;
  OnboardingLink.page = page;
  OnboardingLink.propTypes = Link.propTypes;

  return OnboardingLink;
}

export const OnboardingBreweryAboutLink =
  generateOnboardingLink(typeBrewery, "about");
export const OnboardingBreweryLoginLink =
  generateOnboardingLink(typeBrewery, "login");
export const OnboardingBreweryProductsLink =
  generateOnboardingLink(typeBrewery, "products");
export const OnboardingBrewerySearchLink =
  generateOnboardingLink(typeBrewery, "search");
export const OnboardingBreweryWhatsNextLink =
  generateOnboardingLink(typeBrewery, "whatsNext");

export const OnboardingCustomerAboutLink =
  generateOnboardingLink(typeCustomer, "about");
export const OnboardingCustomerSearchLink =
  generateOnboardingLink(typeCustomer, "search");
export const OnboardingCustomerThankYouLink =
  generateOnboardingLink(typeCustomer, "thankYou");
