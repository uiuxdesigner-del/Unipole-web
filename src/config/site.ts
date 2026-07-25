/**
 * Central editable company/contact data. Referenced by Header, Footer, Enquiry and the
 * detail modal's WhatsApp/quote actions — never duplicate these values elsewhere.
 * Values marked "editable placeholder" should be replaced with verified ADINN details.
 */
export const siteConfig = {
  name: "ADINN Advertising Services Ltd",
  shortName: "ADINN",
  tagline: "Rise Above the Noise.",
  summary:
    "ADINN designs, fabricates and installs premium unipole advertising structures across high-impact roads, highways, junctions and commercial destinations in Tamil Nadu and beyond.",
  // editable placeholder — replace with verified numbers
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "info@adinn.in",
  offices: [
    { city: "Chennai", label: "Head Office" },
    { city: "Madurai", label: "Regional Office" },
  ],
  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    facebook: "https://facebook.com/",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "Why Unipole", href: "#why-unipole" },
    { label: "Explore Sites", href: "#inventory" },
    { label: "Campaigns", href: "#campaigns" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Contact", href: "#enquiry" },
  ],
  cities: [
    "Chennai",
    "Madurai",
    "Coimbatore",
    "Trichy",
    "Salem",
    "Bengaluru",
    "Kerala",
  ],
} as const;
