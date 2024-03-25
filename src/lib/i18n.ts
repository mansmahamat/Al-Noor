import fr from '../locales/french/fr.json'
import en from '../locales/english/en.json'
import ar from '../locales/arabic/ar.json'
import {I18n} from "i18n-js";

export const i18n = new I18n({
    ...fr,
    ...en,
    ...ar
})

i18n.defaultLocale = 'en'