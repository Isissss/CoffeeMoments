import { I18n } from "i18n-js";
import en from "./translations/en.json";
import fr from "./translations/fr.json";
import es from "./translations/es.json";
import zhCh from "./translations/zh-ch.json";
import de from "./translations/de.json";
import nlNL from "./translations/nl-NL.json";

const i18n = new I18n({
	en: en,
	"nl-NL": nlNL,
	"fr-FR": fr,
	"es-ES": es,
	"zh-CH": zhCh,
	"de-DE": de,
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.availableLocales = [
	{ code: "en", languageString: "English" },
	{ code: "fr-FR", languageString: "Francais" },
	{ code: "es-ES", languageString: "Espanol" },
	{ code: "nl-NL", languageString: "Nederlands" },
	{ code: "zh-ch", languageString: "中文" },
	{ code: "de-DE", languageString: "Deutsch" },
];

export const t = (key, language) => {
	i18n.locale = language;
	return i18n.t(key);
};

export default i18n;
