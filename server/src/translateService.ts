import { v2 } from '@google-cloud/translate'
import { config } from './config'

const translate = new v2.Translate({ key: config.GOOGLE_TRANSLATE_API_KEY })

export default translate
