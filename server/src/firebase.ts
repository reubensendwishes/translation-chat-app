import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { config } from './config'
import serviceAccount from '../service-account-key.json'

initializeApp({
	credential: cert(serviceAccount as Parameters<typeof cert>[0]),
	storageBucket: config.FIREBASE_STORAGE_BUCKET,
})

export const bucket = getStorage().bucket()
