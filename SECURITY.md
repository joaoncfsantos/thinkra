# Security Policy

If you discover a security vulnerability in this project, please report it privately rather than opening a public issue.

- Open a [GitHub Security Advisory](../../security/advisories/new) for this repository, or
- Email the maintainer directly (see the GitHub profile linked on the commit history) with details and, if possible, steps to reproduce.

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof of concept
- Any suggested mitigation, if you have one

You should receive an acknowledgement within a few days. This is a personal, unpaid project, so please be patient — there is no bug bounty.

## Scope

This project handles authentication (via Supabase) and short-lived audio recordings sent to OpenAI for transcription. Reports involving auth bypass, access to other users' journal entries (a Row-Level Security bypass), or exposure of API keys/secrets are especially appreciated.
