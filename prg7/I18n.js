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

export const t = i18n.t.bind(i18n);

export default i18n;
