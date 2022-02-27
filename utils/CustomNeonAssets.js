export const fonts = [
  {text: 'Alta Light', family: "AltaLight"},
  {text: 'Lovelo Line Light', family: "LoveloLineLight"},
  { text: "Allura Regular ", family: "AlluraRegular" },
  { text: "Amster1", family: "Amster1" },
  { text: "Amster2", family: "Amster2" },
  { text: "Amster3", family: "Amster3" },
  { text: "Amster4", family: "Amster4" },
  { text: "Andasia ", family: "Andasia" },
  { text: "Architects Daughter", family: "ArchitectsDaughter" },
  { text: "Bakerie", family: "Bakerie" },
  { text: "Billing Miracles", family: "BillingMiracles" },
  { text: "Buffalo", family: "Buffalo" },
  { text: "ColorTime", family: "ColorTime" },
  { text: "Flation", family: "Flation" },
  { text: "The bigmarker", family: "TheBigMarker" },
  { text: "Neoneon", family: "Neoneon" },
  { text: "Nickainle Normal", family: "NickainleyNormal" },
  { text: "Outline", family: "Outline" },
  { text: "PoiretOne Regular", family: "PoiretOneRegular" },
  { text: "TimeBurner Normal", family: "TimeBurnerNormal" },
  { text: "Waltograph", family: "Waltograph" },
];


export const colors = [
  {
    name: "red",
    r: 255,
    g: 0,
    b: 0,
    hex: "#FF0000",
  },
  {
    name: "white",
    r: 255,
    g: 255,
    b: 255,
    hex: "#FFFFFF",
  },
  {
    name: "orange",
    r: 255,
    g: 153,
    b: 0,
    hex: "#FF9900",
  },
  {
    name: "yellow",
    r: 255,
    g: 252,
    b: 0,
    hex: "#FFFC00",
  },
  {
    name: "blue",
    r: 13,
    g: 0,
    b: 255,
    hex: "#0D00FF",
  },
  {
    name: "light blue",
    r: 1,
    g: 224,
    b: 255,
    hex: "#00E0FF",
  },
  {
    name: "mint",
    r: 0,
    g: 255,
    b: 209,
    hex: "#00FFD1",
  },
  {
    name: "green",
    r: 0,
    g: 253,
    b: 9,
    hex: "#00FD09",
  },
  {
    name: "pink",
    r: 255,
    g: 148,
    b: 238,
    hex: "#FF94EE",
  },
  {
    name: "hot pink",
    r: 255,
    g: 1,
    b: 215,
    hex: "#FF01D7",
  },
  {
    name: "purple",
    r: 174,
    g: 1,
    b: 255,
    hex: "#AE01FF",
  },
  {
    name: "multiple color",
    r: 252,
    g: 252,
    b: 252,
    hex: "#fcfcfc",
  },
];


export const icons = [
  {link: "FB logo.png", name: "facebook icon"},
  {link: "IG logo.png", name: "instagram icon"},
  {link: "PT logo.png", name: "pinterest icon"},
  {link: "SC logo.png", name: "snapchat icon"},
  {link: "TT logo.png", name: "tiktok icon"},
  {link: "TW logo.png", name: "twitter icon"},
  {link: "YT logo.png", name: "youtube icon"},
  {link: "HASH logo.png", name: "hash icon"},
];


export const sizes = [
  {
    name: "REGULAR",
    letter: {
      width: 2.5,
      price: 20,
    },
    icon: {
      width: 12,
      height: 12,
      price: 80,
    },
  },
  {
    name: "LARGE",
    letter: {
      width: 3.75,
      price: 30,
    },
    icon: {
      width: 18,
      height: 18,
      price: 120,
    },
  },
];




export const calcWidth = ({
   text,
   sizeName,
   icon,
 }) => {
  const size = sizes.find(i => i.name === sizeName);
   if (!size) throw new Error('Only medium and large size is accepted');

   const textLength = text.length * size.letter.width;
   const iconLength = icon ? size.icon.width : 0;
   return textLength + iconLength;
 };
export const calcPrice = ({
   text,
   sizeName,
   icon,
}) => {
     const size = sizes.find((i) => i.name === sizeName);
     if (!size) throw new Error("Only medium and large size is accepted");
   const textPrice = text.length * size.letter.price;
   const iconPrice = icon ? size.icon.price : 0;
   return textPrice + iconPrice;
 };
