export const GAPI_CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID;

export const RSA = {
	PUBLIC_KEY: process.env.REACT_APP_RSA_PUBLIC_KEY,
};

export const API_PATHS = {
	SHARED: {
		AUTH: {
			INFO: 'auth/info',
			LOGIN: 'auth/login',
			EX_LOGIN: 'auth/login-ex',
			UPDATE_PWD: 'auth/update-password',
			TOKEN_REVOKE: 'auth/token/revoke',
			TOKEN_ROTATE: 'auth/token/rotate',
		},
		TAG: 'tag',
		ROLE: 'role',
		IDEA: 'idea',
		USER: 'user',
		SUB: 'submission',
		COMMENT: 'comment',
		LIKE: 'idea/like',
		VIEW: 'idea/view',
	},
	ADMIN: {
		DASHBOAD: {
			TOTAL: 'dashboard/total-all',
			SUBS_COUNT: 'dashboard/sum-submissions',
			TOP_IDEAS: 'dashboard/top-ideas',
			ACTIVITIES: 'dashboard/activities',
		},
		MANAGE_DEP: 'department-management',
		MANAGE_TAG: 'tag-management',
		MANAGE_IDEA: 'idea-management',
		MANAGE_USER: 'user-management',
		MANAGE_SUB: 'submission-management',
	},
};

export const URL_PATHS = {
	TERM_CONDITION: '/term-condition',
	NOT_FOUND: '/notfound',
	DENY_ACCESS: '/unauthorized',
	ANY: '/',
	HOME: '/homepage',
	LOGIN: '/login',
	SIGNIN: '/signin',
	MANAGE_USER: '/user-management',
	MANAGE_IDEA: '/idea-management',
	MANAGE_SUB: '/submission-management',
	MANAGE_DEP: '/department-management',
	MANAGE_TAG: '/tag-management',
	DASHBOARD: '/dashboard',
	PROFILE: '/profile',
	SUB: '/submission',
	IDEA: '/idea',
};

export const STORAGE_VARS = {
	JWT: 'access_token',
	REFRESH: 'refresh_token',
};

export const ROLES = {
	ADMIN: 'admin',
	STAFF: 'staff',
	MANAGER: 'manager',
	COORDINATOR: 'coordinator',
};
