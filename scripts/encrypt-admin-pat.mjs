// Encrypts a GitHub personal access token with a password so it can be
// safely placed in a public JavaScript bundle without GitHub's secret
// scanning auto-revoking it.
//
// Output format: base64(salt(16) || iv(12) || ciphertext+tag)
//                 │ random per encryption │ AES-256-GCM
//
// Usage:
//   node scripts/encrypt-admin-pat.mjs <password> <pat>
//
// The output goes to stdout. Copy it and paste it as the value of the
// `ADMIN_PAT_ENC` repository secret on GitHub. See ADMIN.md.

import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';

const PBKDF2_ITERATIONS = 600_000;

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error('usage: node scripts/encrypt-admin-pat.mjs <password> <pat>');
  console.error('');
  console.error('  <password>  the password the owner will type into /admin');
  console.error('  <pat>       a fresh GitHub personal access token (ghp_... or github_pat_...)');
  process.exit(1);
}

const [, , password, pat] = process.argv;
if (!password || !pat) usage('missing arguments');
if (pat.length < 30) usage('PAT looks too short — paste the whole token');
if (password.length < 4) usage('password too short — pick at least 4 characters');

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256');

const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(pat, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

// WebCrypto's AES-GCM expects ciphertext + tag concatenated, in that order.
const blob = Buffer.concat([salt, iv, ciphertext, tag]).toString('base64');

console.error(`✔ encrypted (${PBKDF2_ITERATIONS.toLocaleString()} PBKDF2 iters, AES-256-GCM).`);
console.error(`paste this as ADMIN_PAT_ENC:\n`);
console.log(blob);
