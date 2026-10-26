import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import type { User, Session } from '$lib/server/db/schema';

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				DOCUMENTS_BUCKET?: R2Bucket;
				ENVIRONMENT?: string;
				R2_ACCESS_KEY_ID?: string;
				R2_SECRET_ACCESS_KEY?: string;
				R2_ENDPOINT?: string;
				AZURE_STORAGE_CONNECTION_STRING?: string;
				SESSION_SECRET?: string;
			};
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			user?: User | null;
			session?: Session | null;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
