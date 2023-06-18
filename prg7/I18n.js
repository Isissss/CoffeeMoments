import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    hello: "Hi!",
    stores: "Stores",
    settings: "Settings",
    languagePicker: "Pick a language",
    goToMap: "Go to map",
    feed: "Feed",
  },
  fr: {
    hello: "Bonjour!",
    stores: "Magasins",
    settings: "Paramètres",
    languagePicker: "Choisissez une langue",
    goToMap: "Aller à la carte",
    feed: "Alimentation",
  },
  es: {
    hello: "Hola!",
    stores: "Tiendas",
    settings: "Ajustes",
    languagePicker: "Elige un idioma",
    goToMap: "Ir al mapa",
    feed: "Alimentación",
  },
  "nl-NL": {
    hello: "Hallo!",
    stores: "Winkels",
    settings: "Instellingen",
    languagePicker: "Kies een taal",
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
