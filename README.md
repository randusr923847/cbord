# Campus Bord

A simple site to show events happening on campus!

## Contributing

To set up a local dev environment:

- fork or clone the repo: `git clone https://github.com/randusr923847/cbord.git`
- copy [`exampledotenv.txt`](/exampledotenv) into a `.env` file and change values as needed.
- p.s. use nvm to get node `v24.5.0` and npm `11.5.1`

Run `npm install` to install dependencies.

Run `npm run build` to build [`/src`](/src) to `/dist`, and `npm start` to start the server.
(On Windows, use `npm run buildw`)

To use https for local development (required for admin page auth), run these commands in root to add local certs:

```
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem
```

For admin page auth, we use [Myst Auth](https://github.com/mystsec/MystAuth).
To give a moderator admin page access (for local development):

- Go to the admin page (`/admin`) on localhost, this will redirect to the auth portal
- Sign up for an account (remember the username you use), this will add a passkey to your device
- Initially the auth portal will redirect to a 404 page since this username hasn't been added to the white list
- In root, run this command with the username of the account to add: `ts-node src/helpers/mod.ts your_username`
- Now logging in with this account will redirect you to the admin page to accept/reject events
