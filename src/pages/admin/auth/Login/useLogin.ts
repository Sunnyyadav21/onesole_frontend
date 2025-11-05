// @ts-nocheck
import { authApi, useAuthContext } from '@/common'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '@/types'

export default function useLogin() {
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	const { isAuthenticated, saveSession } = useAuthContext()

	const redirectUrl = useMemo(() =>
		location.state && location.state.from
			? location.state.from.pathname
			: '/medicalapp',
		[location.state]
	)

	const login = async ({ email, password }: User) => {
		setLoading(true)
		try {
			const res: any = await authApi.login({ email, password })
			if (res.token) {
				console.log(res.use);
				
				saveSession({ ...(res.user ?? {}), token: res.token })
				console.log(redirectUrl, location)
				navigate(redirectUrl)
				console.log(redirectUrl)
			}
		} finally {
			setLoading(false)
		}
	}

	return { loading, login, redirectUrl, isAuthenticated }
}
