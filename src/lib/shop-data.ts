/**
 * The site's original hardcoded catalog and copy.
 *
 * Since the CMS landed this file has exactly one job: it is the source for
 * `src/lib/cms/fallback.ts`, which reshapes it into the CMS contract so the
 * site still renders when the CMS is unreachable or not yet seeded. Nothing
 * else should import it — pages read from `@/lib/cms/queries` instead.
 */
import favorImg from "@/assets/cat-favor.jpg";
import tinImg from "@/assets/cat-tin.jpg";
import sweetImg from "@/assets/cat-sweet.jpg";
import babyImg from "@/assets/cat-baby.jpg";
import velvetAsset from "@/assets/velvet-mashallah-plaques.jpg.asset.json";
import bazubandAsset from "@/assets/bazuband-armbands.jpg.asset.json";
import qaboolAsset from "@/assets/qubool-hai-pen.jpg.asset.json";
import mehndiBehenAsset from "@/assets/mehndi-sign-behen.jpg.asset.json";
import mehndiRoundAsset from "@/assets/mehndi-sign-round.jpg.asset.json";
import saliyanAsset from "@/assets/dulhay-ki-saliyan-sign.jpg.asset.json";
import dholkiConeAsset from "@/assets/dholki-cone-favours.jpg.asset.json";
import baatPakkiConeAsset from "@/assets/baat-pakki-cone-favours.jpg.asset.json";
import quboolJarAsset from "@/assets/qubool-hai-acrylic-jar.jpg.asset.json";
import quboolChocAsset from "@/assets/qubool-hai-chocolate-box.jpg.asset.json";
import shadiTensionAsset from "@/assets/shadi-tension-canvas-sign.jpg.asset.json";
import bhaagJaAsset from "@/assets/bhaag-ja-placard-sign.jpg.asset.json";
import velvetGotaAsset from "@/assets/velvet-gota-mehndi-plaques.jpg.asset.json";
import coupleTinAsset from "@/assets/printed-couple-tin-boxes.jpg.asset.json";
import treasureChestAsset from "@/assets/gold-treasure-chest-favour.jpg.asset.json";
import saunfBoxAsset from "@/assets/gold-saunf-serving-box.jpg.asset.json";
import jutePouchAsset from "@/assets/jute-pouch-favour.jpg.asset.json";
import goldFoilBoxAsset from "@/assets/gold-foil-ribbon-favour-box.jpg.asset.json";
import pyramidBoxAsset from "@/assets/navy-gold-pyramid-favour-box.jpg.asset.json";
import pinkConeAsset from "@/assets/pink-tag-mishri-cone.jpg.asset.json";

export const WHATSAPP_NUMBER = "923079701492";
export const INSTAGRAM_URL = "https://www.instagram.com/thebidhcraft/";
export const EMAIL = "thebidhcraft@gmail.com";
export const PHONE_DISPLAY = "0307 9701492";

export type OccasionSlug = "nikkah" | "walima" | "mehndi" | "aqeeqa" | "birthday";

export type CategorySlug =
  | "bid-favor-boxes"
  | "tin-boxes"
  | "sweet-boxes"
  | "baby-announcement-boxes"
  | "nikkah-signs-pens"
  | "mehndi-handheld-signs"
  | "bazuband-armbands"
  | "velvet-nameplates"
  | "cone-favours"
  | "qubool-hai-favours";

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  intro: string;
  image: string;
  imageAlt: string;
};

export const categories: Category[] = [
  {
    slug: "bid-favor-boxes",
    name: "Bid Boxes / Favor Boxes",
    short: "The classic hand-printed guest favor.",
    intro:
      "Our signature bid boxes are the little hand-printed keepsakes you hand to every guest as they leave. Two-piece lids, satin ribbon and floral block prints — perfect for Nikkah (the marriage ceremony), Walima receptions and Mehndi nights. Fill them with mithai, dry fruit, chocolates or trinkets.",
    image: favorImg,
    imageAlt: "Stack of handmade pink hand-printed favor boxes with ribbon",
  },
  {
    slug: "tin-boxes",
    name: "Tin Boxes",
    short: "Durable, reusable and beautifully printed.",
    intro:
      "Tin boxes are durable, reusable and feel instantly premium in the hand — ideal for sweets, dry fruit and chocolate gifting. Each lid is hand-printed or hand-painted, so guests keep them long after the event.",
    image: tinImg,
    imageAlt: "Round rose gold floral hand-painted tin gift boxes",
  },
  {
    slug: "sweet-boxes",
    name: "Sweet Boxes",
    short: "Mithai and dessert boxes with compartments.",
    intro:
      "Built for mithai, barfi, chocolates and dessert portions with neat compartments and sturdy lids. A favourite for Walima (the reception hosted after the wedding) and Aqeeqa distributions where boxes travel between homes.",
    image: sweetImg,
    imageAlt: "Open handmade salmon sweet box with gold detailing and mithai",
  },
  {
    slug: "baby-announcement-boxes",
    name: "Baby Announcement Boxes",
    short: "For Aqeeqa and newborn news.",
    intro:
      "Soft pastel boxes to announce your newest arrival, made for Aqeeqa (the celebration held for a newborn) and baby showers. Hand-printed clouds, stars and tiny bows — personalised with baby's name on request.",
    image: babyImg,
    imageAlt: "Pastel pink and mint baby announcement gift boxes with bows",
  },
  {
    slug: "nikkah-signs-pens",
    name: "Nikkah Signs & Qubool Hai Pens",
    short: "Gold calligraphy props for the signing moment.",
    intro:
      "The Nikkah signing is the single most photographed minute of the whole wedding. Our hand-cut \u201cQubool Hai\u201d pens, feather toppers and calligraphy signs are made in gold mirror-finish with fresh-flower gota wrapping, so the bride and groom hold something beautiful in every frame.",
    image: qaboolAsset.url,
    imageAlt: "Gold Qubool Hai calligraphy pens with white feather and gota flower wrap",
  },
  {
    slug: "mehndi-handheld-signs",
    name: "Mehndi Handheld Signs",
    short: "Round embroidered boards for the baraat entry.",
    intro:
      "Handheld round signs for the Mehndi and Baraat entrance \u2014 \u201cMeri Behen Ki Mehndi\u201d, \u201cDulhay Ki Saliyan\u201d, or any line you want in Urdu or English. Velvet or embroidered base, gota-kinari border, tiny pom-poms and a wrapped handle. Made to be waved, danced with and photographed.",
    image: mehndiBehenAsset.url,
    imageAlt: "Green embroidered round Mehndi handheld sign with gold Urdu calligraphy",
  },
  {
    slug: "bazuband-armbands",
    name: "Bazuband Armbands",
    short: "MashAllah armbands for the bride and groom.",
    intro:
      "Matching bazuband armbands worn on the sleeve at Mayun, Mehndi and Nikkah. Velvet base with hand-embroidered \u201cMashAllah\u201d in zari, mirror work and gota edging, finished with adjustable ties so they sit perfectly on any sleeve.",
    image: bazubandAsset.url,
    imageAlt: "Green velvet MashAllah bazuband armbands worn by a couple at their Mayun",
  },
  {
    slug: "velvet-nameplates",
    name: "Velvet Nameplates & Wall Hangings",
    short: "Keepsake zari calligraphy on velvet.",
    intro:
      "Deep velvet panels with hand-glittered zari calligraphy, mirror-studded gota borders and hanging cords \u2014 \u201cMashAllah\u201d, \u201cAyat-ul-Kursi\u201d, family names or a wedding date. Made as a decor piece for the event and a keepsake for the home afterwards.",
    image: velvetAsset.url,
    imageAlt: "Two maroon velvet MashAllah plaques with gold glitter calligraphy and gota borders",
  },
  {
    slug: "cone-favours",
    name: "Cone Favours (Dholki & Baat Pakki)",
    short: "Sonf-supari cones with personalised tags.",
    intro:
      "Clear cone favours filled with sonf, supari or colourful mishri, sealed with satin ribbon and finished with a printed tag carrying your name and date \u2014 \u201cFilza Ki Dholki\u201d, \u201cBaat Pakki\u201d, \u201cDua-e-Khair\u201d. The fastest, prettiest giveaway for Dholki nights, Baat Pakki and Mehndi trays.",
    image: dholkiConeAsset.url,
    imageAlt: "Hand holding two clear cone favours of colourful mishri with pink Dholki tags",
  },
  {
    slug: "qubool-hai-favours",
    name: "Qubool Hai Nikkah Favours",
    short: "Acrylic jars and chocolate boxes for the Nikkah.",
    intro:
      "Nikkah-day giveaways built around one line: \u201cQubool Hai\u201d. Clear acrylic keepsake jars with dry fruit and a personalised sage label, plus slim gold-foiled chocolate boxes for Baat Pakki and Dua-e-Khair. Names and date printed on every piece; plain customisable versions also available.",
    image: quboolJarAsset.url,
    imageAlt: "Clear acrylic Qubool Hai favour jar with sage label filled with dry fruit",
  },
];

export const occasions: {
  slug: OccasionSlug;
  name: string;
  note: string;
  emoji: string;
}[] = [
  { slug: "nikkah", name: "Nikkah", note: "The marriage ceremony", emoji: "💍" },
  { slug: "walima", name: "Walima", note: "The reception after", emoji: "🌸" },
  { slug: "mehndi", name: "Mehndi", note: "The henna night", emoji: "🪔" },
  { slug: "aqeeqa", name: "Aqeeqa", note: "Newborn celebration", emoji: "🍼" },
  { slug: "birthday", name: "Birthdays", note: "Every happy year", emoji: "🎂" },
];

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  occasions: OccasionSlug[];
  /** Boxes are priced per piece. Other pieces are quoted on WhatsApp by quantity. */
  price?: number;
  featured?: boolean;
  blurb: string;
  image?: string;
  unit?: string;
};

/** Box collections are priced per piece within this range. */
export const BOX_PRICE_MIN = 150;
export const BOX_PRICE_MAX = 210;
export const QUOTE_NOTE = "Priced on WhatsApp as per quantity";

/** Days of notice needed before an event. */
export const LEAD_TIME_DAYS = 5;

const BOX_CATEGORIES: CategorySlug[] = [
  "bid-favor-boxes",
  "tin-boxes",
  "sweet-boxes",
  "baby-announcement-boxes",
];

export function isBoxCategory(slug: CategorySlug) {
  return BOX_CATEGORIES.includes(slug);
}

export const products: Product[] = [
  // Bid / Favor boxes
  {
    id: "fb-1",
    name: "Floral Two-Piece Favor Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "walima"],
    price: 160,
    featured: true,
    blurb: "Hand block-printed lid with satin ribbon.",
  },
  {
    id: "fb-2",
    name: "Cotton Rose Nikkah Bid Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah"],
    price: 170,
    featured: true,
    blurb: "Blush pink with gold-foil name tag.",
  },
  {
    id: "fb-3",
    name: "Gold Leaf Walima Favor Box",
    category: "bid-favor-boxes",
    occasions: ["walima"],
    price: 180,
    blurb: "Soft gold leaf print on warm white.",
  },
  {
    id: "fb-4",
    name: "Mehndi Trinket Box",
    category: "bid-favor-boxes",
    occasions: ["mehndi"],
    price: 165,
    featured: true,
    blurb: "Marigold motifs, hand-painted edges.",
  },
  {
    id: "fb-5",
    name: "Pearl Ribbon Pillow Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "walima"],
    price: 150,
    blurb: "Curved pillow shape with pearl tie.",
  },
  {
    id: "fb-6",
    name: "Mini Jute-Tie Favor Box",
    category: "bid-favor-boxes",
    occasions: ["mehndi", "birthday"],
    price: 150,
    blurb: "Rustic jute tie, printed sleeve.",
  },
  {
    id: "fb-7",
    name: "Hand-Printed Chocolate Bid Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "birthday"],
    price: 175,
    blurb: "Fits 4 chocolates snugly.",
  },
  {
    id: "fb-8",
    name: "Blossom Window Favor Box",
    category: "bid-favor-boxes",
    occasions: ["walima", "birthday"],
    price: 190,
    blurb: "Clear window to show what's inside.",
  },

  // Tin boxes
  {
    id: "tb-1",
    name: "Rose Gold Tin Box",
    category: "tin-boxes",
    occasions: ["nikkah", "walima"],
    price: 200,
    featured: true,
    blurb: "Reusable tin, hand-printed floral lid.",
  },
  {
    id: "tb-2",
    name: "Blush Floral Round Tin",
    category: "tin-boxes",
    occasions: ["mehndi", "birthday"],
    price: 190,
    blurb: "Watercolour bloom on a matte lid.",
  },
  {
    id: "tb-3",
    name: "Sage Garden Tin Box",
    category: "tin-boxes",
    occasions: ["walima"],
    price: 185,
    blurb: "Muted sage with fine line florals.",
  },
  {
    id: "tb-4",
    name: "Dry Fruit Gifting Tin",
    category: "tin-boxes",
    occasions: ["nikkah", "walima"],
    price: 210,
    featured: true,
    blurb: "Deep tin for dry fruit portions.",
  },
  {
    id: "tb-5",
    name: "Petite Keepsake Tin",
    category: "tin-boxes",
    occasions: ["mehndi", "birthday"],
    price: 160,
    blurb: "Pocket-size, ideal for bangles.",
  },
  {
    id: "tb-6",
    name: "Gold Rim Mithai Tin",
    category: "tin-boxes",
    occasions: ["walima", "aqeeqa"],
    price: 205,
    blurb: "Gold rim with printed centre.",
  },
  {
    id: "tb-7",
    name: "Birthday Confetti Tin",
    category: "tin-boxes",
    occasions: ["birthday"],
    price: 175,
    blurb: "Hand-dotted confetti print.",
  },

  // Sweet boxes
  {
    id: "sb-1",
    name: "Aqeeqa Baby Boy Sweet Box",
    category: "sweet-boxes",
    occasions: ["aqeeqa"],
    price: 180,
    featured: true,
    blurb: "Four-compartment mithai box.",
  },
  {
    id: "sb-2",
    name: "Aqeeqa Baby Girl Sweet Box",
    category: "sweet-boxes",
    occasions: ["aqeeqa"],
    price: 180,
    blurb: "Soft pink with printed booties.",
  },
  {
    id: "sb-3",
    name: "Walima Mithai Box (6 pc)",
    category: "sweet-boxes",
    occasions: ["walima"],
    price: 200,
    featured: true,
    blurb: "Six-portion box with insert tray.",
  },
  {
    id: "sb-4",
    name: "Nikkah Barfi Box",
    category: "sweet-boxes",
    occasions: ["nikkah"],
    price: 165,
    blurb: "Slim box for barfi and ladoo.",
  },
  {
    id: "sb-5",
    name: "Two-Tier Dessert Box",
    category: "sweet-boxes",
    occasions: ["walima", "birthday"],
    price: 210,
    blurb: "Stacked tiers with ribbon lock.",
  },
  {
    id: "sb-6",
    name: "Mehndi Sweet Pouch Box",
    category: "sweet-boxes",
    occasions: ["mehndi"],
    price: 155,
    blurb: "Pouch fold with henna motifs.",
  },
  {
    id: "sb-7",
    name: "Birthday Cupcake Box",
    category: "sweet-boxes",
    occasions: ["birthday"],
    price: 170,
    blurb: "Holds two cupcakes safely.",
  },

  // Baby announcement
  {
    id: "ba-1",
    name: "Baby Announcement Cloud Box",
    category: "baby-announcement-boxes",
    occasions: ["aqeeqa"],
    price: 175,
    featured: true,
    blurb: "Hand-printed clouds and stars.",
  },
  {
    id: "ba-2",
    name: "It's a Boy Announcement Box",
    category: "baby-announcement-boxes",
    occasions: ["aqeeqa"],
    price: 180,
    blurb: "Mint ribbon with name card.",
  },
  {
    id: "ba-3",
    name: "It's a Girl Announcement Box",
    category: "baby-announcement-boxes",
    occasions: ["aqeeqa"],
    price: 180,
    blurb: "Blush ribbon with name card.",
  },
  {
    id: "ba-4",
    name: "Little Star Newborn Box",
    category: "baby-announcement-boxes",
    occasions: ["aqeeqa"],
    price: 160,
    blurb: "Tiny gold stars, hand-stamped.",
  },
  {
    id: "ba-5",
    name: "Baby Shower Favor Box",
    category: "baby-announcement-boxes",
    occasions: ["aqeeqa", "birthday"],
    price: 150,
    blurb: "Mini favors for shower guests.",
  },
  {
    id: "ba-6",
    name: "First Birthday Keepsake Box",
    category: "baby-announcement-boxes",
    occasions: ["birthday"],
    price: 185,
    blurb: "Keepsake box for year one.",
  },

  // Nikkah signs & Qubool Hai pens — quoted on WhatsApp
  {
    id: "np-1",
    name: "Qubool Hai Feather Pen Set",
    category: "nikkah-signs-pens",
    occasions: ["nikkah"],
    featured: true,
    unit: "pair",
    image: qaboolAsset.url,
    blurb: "Two gold pens, feather top, gota flower wrap.",
  },
  {
    id: "np-2",
    name: "Gold Mirror Qubool Hai Sign",
    category: "nikkah-signs-pens",
    occasions: ["nikkah"],
    unit: "piece",
    image: qaboolAsset.url,
    blurb: "Hand-cut mirror calligraphy on a wrapped stick.",
  },
  {
    id: "np-3",
    name: "Nikkah Signing Pen (Single)",
    category: "nikkah-signs-pens",
    occasions: ["nikkah"],
    unit: "piece",
    image: qaboolAsset.url,
    blurb: "One pen with pearl and fresh-flower detail.",
  },
  {
    id: "np-4",
    name: "Alhamdulillah Nikkah Board",
    category: "nikkah-signs-pens",
    occasions: ["nikkah", "walima"],
    unit: "piece",
    image: velvetAsset.url,
    blurb: "Velvet board for the couple's first photo.",
  },

  // Mehndi handheld signs — quoted on WhatsApp
  {
    id: "ms-1",
    name: "Meri Behen Ki Mehndi Sign",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi"],
    featured: true,
    unit: "piece",
    image: mehndiBehenAsset.url,
    blurb: "Green embroidered round with gota border.",
  },
  {
    id: "ms-2",
    name: "Dulhay Ki Saliyan Round Sign",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi", "walima"],
    featured: true,
    unit: "piece",
    image: saliyanAsset.url,
    blurb: "Bottle-green velvet with gold lettering.",
  },
  {
    id: "ms-3",
    name: "Custom Urdu Calligraphy Sign",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi", "nikkah"],
    unit: "piece",
    image: mehndiRoundAsset.url,
    blurb: "Any line you want, hand-lettered in Urdu.",
  },
  {
    id: "ms-4",
    name: "Pom-Pom Baraat Entry Sign",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi"],
    unit: "piece",
    image: mehndiRoundAsset.url,
    blurb: "Colour pom-poms and wrapped handle.",
  },
  {
    id: "ms-5",
    name: "Mini Mehndi Sign (Set of 4)",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi", "birthday"],
    unit: "set",
    image: mehndiBehenAsset.url,
    blurb: "Small signs for the whole squad.",
  },

  // Bazuband armbands — quoted on WhatsApp
  {
    id: "bz-1",
    name: "MashAllah Velvet Bazuband (Pair)",
    category: "bazuband-armbands",
    occasions: ["nikkah", "mehndi"],
    featured: true,
    unit: "pair",
    image: bazubandAsset.url,
    blurb: "Bride and groom set, zari embroidery.",
  },
  {
    id: "bz-2",
    name: "Green Zari Bazuband",
    category: "bazuband-armbands",
    occasions: ["mehndi"],
    unit: "piece",
    image: bazubandAsset.url,
    blurb: "Classic Mayun green with mirror work.",
  },
  {
    id: "bz-3",
    name: "Maroon Velvet Bazuband",
    category: "bazuband-armbands",
    occasions: ["nikkah", "walima"],
    unit: "piece",
    image: velvetAsset.url,
    blurb: "Deep maroon with gold gota edging.",
  },
  {
    id: "bz-4",
    name: "Personalised Name Bazuband",
    category: "bazuband-armbands",
    occasions: ["nikkah", "mehndi"],
    unit: "piece",
    image: bazubandAsset.url,
    blurb: "Your name hand-embroidered in zari.",
  },

  // Velvet nameplates & wall hangings — quoted on WhatsApp
  {
    id: "vn-1",
    name: "MashAllah Velvet Plaque",
    category: "velvet-nameplates",
    occasions: ["nikkah", "aqeeqa"],
    featured: true,
    unit: "piece",
    image: velvetAsset.url,
    blurb: "Maroon velvet, gold glitter calligraphy.",
  },
  {
    id: "vn-2",
    name: "MashAllah Plaque Pair",
    category: "velvet-nameplates",
    occasions: ["nikkah", "walima"],
    unit: "pair",
    image: velvetAsset.url,
    blurb: "Two matching hangings with cords.",
  },
  {
    id: "vn-3",
    name: "Baby Name Velvet Hanging",
    category: "velvet-nameplates",
    occasions: ["aqeeqa", "birthday"],
    unit: "piece",
    image: velvetAsset.url,
    blurb: "Newborn's name in zari on soft velvet.",
  },
  {
    id: "vn-4",
    name: "Wedding Date Keepsake Panel",
    category: "velvet-nameplates",
    occasions: ["nikkah", "walima"],
    unit: "piece",
    image: velvetAsset.url,
    blurb: "Your date, kept long after the day.",
  },

  // Cone favours — quoted on WhatsApp
  {
    id: "cf-1",
    name: "Dholki Mishri Cone Favour",
    category: "cone-favours",
    occasions: ["mehndi"],
    featured: true,
    unit: "cone",
    image: dholkiConeAsset.url,
    blurb: "Colour mishri cone with pink personalised tag.",
  },
  {
    id: "cf-2",
    name: "Baat Pakki Sonf-Supari Cone",
    category: "cone-favours",
    occasions: ["nikkah"],
    featured: true,
    unit: "cone",
    image: baatPakkiConeAsset.url,
    blurb: "Sage tag, sonf on top, mishri below.",
  },
  {
    id: "cf-3",
    name: "Mehndi Cone Favour Tray (Set of 20)",
    category: "cone-favours",
    occasions: ["mehndi"],
    unit: "set",
    image: dholkiConeAsset.url,
    blurb: "Ready-arranged fan tray for the Mehndi table.",
  },
  {
    id: "cf-4",
    name: "Custom Name & Date Cone Tags",
    category: "cone-favours",
    occasions: ["nikkah", "mehndi", "birthday"],
    unit: "set",
    image: baatPakkiConeAsset.url,
    blurb: "Printed tags in your colours and font.",
  },

  // Qubool Hai nikkah favours — quoted on WhatsApp
  {
    id: "qh-1",
    name: "Qubool Hai Acrylic Keepsake Jar",
    category: "qubool-hai-favours",
    occasions: ["nikkah"],
    featured: true,
    unit: "jar",
    image: quboolJarAsset.url,
    blurb: "Clear jar, sage label with names and date.",
  },
  {
    id: "qh-2",
    name: "Qubool Hai Chocolate Box",
    category: "qubool-hai-favours",
    occasions: ["nikkah", "walima"],
    featured: true,
    unit: "box",
    image: quboolChocAsset.url,
    blurb: "Slim white box with gold-foil Urdu calligraphy.",
  },
  {
    id: "qh-3",
    name: "Dua-e-Khair Favour Box",
    category: "qubool-hai-favours",
    occasions: ["nikkah"],
    unit: "box",
    image: quboolChocAsset.url,
    blurb: "Same box, Dua-e-Khair wording.",
  },
  {
    id: "qh-4",
    name: "Plain Customisable Favour Box",
    category: "qubool-hai-favours",
    occasions: ["nikkah", "walima", "birthday"],
    unit: "box",
    image: quboolChocAsset.url,
    blurb: "Blank box — add any line you like.",
  },
  {
    id: "qh-5",
    name: "Gold Treasure Chest Favour",
    category: "qubool-hai-favours",
    occasions: ["nikkah", "walima", "birthday"],
    featured: true,
    unit: "piece",
    image: treasureChestAsset.url,
    blurb: "Clear acrylic chest, gold frame, satin bow and printed name tag.",
  },
  {
    id: "qh-6",
    name: "Gold Saunf & Supari Serving Box",
    category: "qubool-hai-favours",
    occasions: ["nikkah", "walima"],
    unit: "piece",
    image: saunfBoxAsset.url,
    blurb: "Ornate gold chest for saunf, supari or mishri on the head table.",
  },

  // New photographed pieces in existing collections
  {
    id: "fb-9",
    name: "Navy & Gold Pyramid Nikkah Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "walima"],
    price: 195,
    featured: true,
    image: pyramidBoxAsset.url,
    blurb: "Couple's names in gold foil on deep navy, satin bow at the top.",
  },
  {
    id: "fb-10",
    name: "Ivory Gold-Foil Ribbon Favor Box",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "walima"],
    price: 185,
    image: goldFoilBoxAsset.url,
    blurb: "Monogram tag, gold foil crest and a full satin bow.",
  },
  {
    id: "fb-11",
    name: "Jute Pouch Favour with Name Tag",
    category: "bid-favor-boxes",
    occasions: ["nikkah", "mehndi"],
    price: 150,
    image: jutePouchAsset.url,
    blurb: "Rustic jute drawstring pouch with a printed floral name tag.",
  },

  {
    id: "tb-8",
    name: "Printed Couple Portrait Tin",
    category: "tin-boxes",
    occasions: ["nikkah", "walima"],
    price: 210,
    featured: true,
    image: coupleTinAsset.url,
    blurb: "Your illustrated portrait on the lid, gold rim, reusable tin.",
  },

  {
    id: "cf-5",
    name: "Pink Tag Mishri & Sonf Cone",
    category: "cone-favours",
    occasions: ["mehndi", "nikkah"],
    unit: "cone",
    image: pinkConeAsset.url,
    blurb: "Bright pink foil tag with the couple's names, layered mishri and sonf.",
  },

  {
    id: "ms-6",
    name: "Shadi Meri, Tension Apko Canvas Sign",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi", "nikkah"],
    featured: true,
    unit: "piece",
    image: shadiTensionAsset.url,
    blurb: "Large hand-painted canvas board for the photo corner.",
  },
  {
    id: "ms-7",
    name: "Abhi Bhi Time Hai Bhaag Ja Placard",
    category: "mehndi-handheld-signs",
    occasions: ["mehndi", "walima"],
    unit: "piece",
    image: bhaagJaAsset.url,
    blurb: "Bold yellow-on-pink cutout letters with mandala print.",
  },

  {
    id: "vn-5",
    name: "Mehndi Lgao Velvet Gota Sign Set",
    category: "velvet-nameplates",
    occasions: ["mehndi"],
    featured: true,
    unit: "set",
    image: velvetGotaAsset.url,
    blurb: "Four velvet panels — Mehndi Lgao, Nacho Gao, Photo Khincho, Khao Piyo.",
  },
];

export const clients = [
  "Honda",
  "UCP",
  "HBL",
  "KFC",
  "Suzuki",
  "Jannat Mirza",
  "Sehar Hayat",
  "Sistrology",
  "Ducky Bhai",
  "Aroob Jatoi",
  "Brighto Paints",
  "Rajab Butt",
  "BOP",
];

export type ProductSpecs = {
  material: string;
  size: string;
  unit: string;
  finish: string;
  moq: string;
};

const categorySpecs: Record<CategorySlug, Omit<ProductSpecs, "unit">> = {
  "bid-favor-boxes": {
    material: "300gsm hand-printed board with satin ribbon",
    size: "Approx. 3.5 x 3.5 x 2 inches",
    finish: "Matte hand block print, gold-foil name tag optional",
    moq: "Minimum 20 pieces",
  },
  "tin-boxes": {
    material: "Food-safe reusable tin with printed lid",
    size: "Approx. 4 inch diameter x 2 inch depth",
    finish: "Matte lid print, wipe-clean and reusable",
    moq: "Minimum 20 pieces",
  },
  "sweet-boxes": {
    material: "Food-grade board with insert tray",
    size: "Approx. 6 x 6 x 2 inches",
    finish: "Hand-printed sleeve, compartment inserts included",
    moq: "Minimum 25 pieces",
  },
  "baby-announcement-boxes": {
    material: "Rigid board with ribbon tie and name card",
    size: "Approx. 5 x 5 x 2.5 inches",
    finish: "Hand-stamped motifs, personalised baby name card",
    moq: "Minimum 15 pieces",
  },
  "nikkah-signs-pens": {
    material: "Acrylic / MDF sign, metal pen with resin topper",
    size: "Sign approx. 8 inches, pen standard length",
    finish: "Hand-glittered calligraphy, name and date customisable",
    moq: "Available as single pieces",
  },
  "mehndi-handheld-signs": {
    material: "Foam board with wooden handle",
    size: "Approx. 10-12 inches across",
    finish: "Hand-cut lettering, glitter or matte finish",
    moq: "Available as single pieces",
  },
  "bazuband-armbands": {
    material: "Velvet base with gota, pearls and zari work",
    size: "Adjustable tie, fits most arm sizes",
    finish: "Hand-embellished, sold as a matching pair",
    moq: "Sold per pair",
  },
  "velvet-nameplates": {
    material: "Velvet panel on board with hanging cord",
    size: "Approx. 12 x 9 inches",
    finish: "Hand-glittered zari calligraphy with gota border",
    moq: "Available as single pieces",
  },
  "cone-favours": {
    material: "Food-grade clear cone, satin ribbon, printed tag",
    size: "Approx. 7 inch cone",
    finish: "Filled with sonf, supari or mishri; name and date printed",
    moq: "Minimum 30 cones",
  },
  "qubool-hai-favours": {
    material: "Clear acrylic jar or rigid gold-foiled board box",
    size: "Jar approx. 2.5 inches; box approx. 6 x 2 inches",
    finish: "Personalised label with couple's names and Nikkah date",
    moq: "Minimum 20 pieces",
  },
};

export function productSpecs(product: Product): ProductSpecs {
  const base = categorySpecs[product.category];
  return { ...base, unit: product.unit ?? "box" };
}
