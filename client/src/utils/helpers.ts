import axios from 'axios'

export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	delay = 200,
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | undefined
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

export function removePrefix(str: string, prefix: string) {
	const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	return str.replace(new RegExp('^' + escaped), '')
}

export function kebabToCamel(str: string) {
	return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export function handleRequestError(error: unknown) {
	if (axios.isAxiosError(error) && error.response) {
		return { success: false, detail: error.response.data.detail }
	}
	return { success: false, detail: 'Internal server error' }
}
