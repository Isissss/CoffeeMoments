import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    settings: {
      title: "Settings",
      languagePicker: "Pick a language",
      themePicker: "Pick a theme",
    },
    hello: "Hi!",
    stores: "Stores",
    goToMap: "Go to map",
    feed: "Feed",
    noInternet: {
      title: "No internet!",
      message: "Connect to the internet to view the map.",
    },
  },
  fr: {
    settings: {
      title: "Paramètres",
      languagePicker: "Choisissez une langue",
      themePicker: "Choisissez un thème",
    },
    hello: "Bonjour!",
    stores: "Magasins",

    goToMap: "Aller à la carte",
    feed: "Alimentation",
    noInternet: {
      title: "Pas d'internet!",
      message: "Connectez-vous à Internet pour voir la carte.",
    },
  },
  es: {
    settings: {
      title: "Ajustes",
      languagePicker: "Elige un idioma",
      themePicker: "Elige un tema",
    },
    hello: "Hola!",
    stores: "Tiendas",

    goToMap: "Ir al mapa",
    feed: "Alimentación",
    noInternet: {
      title: "¡Sin internet!",
      message: "Conéctese a Internet para ver el mapa.",
    },
  },
  "nl-NL": {
    settings: {
      title: "Instellingen",
      languagePicker: "Kies een taal",
      themePicker: "Kies een thema",
    },
    hello: "Hallo!",
    stores: "Winkels",

    goToMap: "Ga naar kaart",
    feed: "Voeden",
    noInternet: {
      title: "Geen internet!",
      message: "Verbind met internet om de kaart te kunnen bekijken.",
    },
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.fallbacks = true;
i18n.availableLocales = [
  { code: "en", languageString: "English" },
  { code: "fr", languageString: "Francais" },
  { code: "es", languageString: "Espanol" },
  { code: "nl-NL", languageString: "Nederlands" },
];

export const t = (key, language) => {
  i18n.locale = language;
  return i18n.t(key);
};

export default i18n;
