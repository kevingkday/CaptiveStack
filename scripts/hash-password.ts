import { hashPassword } from '../src/lib/server/auth/password.ts';

const password = process.argv[2];
if (!password || password.startsWith('-')) {
	console.error('Usage: npx tsx scripts/hash-password.ts <new-password>');
	console.error('Prints a PBKDF2 password_hash for D1. The password is not printed.');
	process.exit(1);
}

console.log(await hashPassword(password));
