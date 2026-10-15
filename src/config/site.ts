export const siteConfig = {
  name: "OXSA Nepal Animal Welfare Society",
  shortName: "Oxsa Nepal",
  description: "An animal-welfare nonprofit working for safer, healthier lives for street animals in Nepal.",
  url: "https://oxsa-nepal.digitalsaugatb.chatgpt.site",
  phone: "9849321303",
  email: "mail@oxsanepal.org",
  shelter: "Jwagal, Lalitpur",
  office: "Jhamsikhel, Lalitpur",
  visitingHours: "9:00 AM – 4:00 PM",
  social: { facebook: "", instagram: "", youtube: "" },
  donations: {
    banks: [
      { bank: "Nabil Bank Ltd", accountName: "Oxsa Nepal Animal Welfare Society", accountNumber: "01901017501825", branch: "Pulchowk" },
    ],
    esewa: { name: "Oxsa Nepal Animal Welfare Organization", number: "9849321303" },
    paypal: "sonysukaso@gmail.com",
  },
} as const;

export const nav = [
  ["Home", "/"], ["About", "/about"], ["Our Work", "/our-work"],
  ["Adopt", "/adopt"], ["Sponsor", "/sponsor"], ["Stories", "/stories"], ["Contact", "/contact"],
] as const;

export const exploreNav = [
  ["Blog", "/blog"], ["Vet Centres", "/vet-centres"], ["FAQ", "/faq"],
  ["Wishlist", "/wishlist"], ["Media", "/media"],
] as const;
