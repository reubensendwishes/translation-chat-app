import { createI18n } from 'vue-i18n'
import zhTW from '@/i18n/locales/zh-TW.json'
import vi from '@/i18n/locales/vi.json'

const i18n = createI18n({
	legacy: false,
	locale: 'zh-TW',
	fallbackLocale: 'vi',
	messages: {
		'zh-TW': zhTW,
		vi,
	},
})

export default i18n
