# Campus Bord

A simple site to show events happening on campus!

## Contributing

To set up a local dev environment:

- fork or clone the repo: `git clone https://github.com/randusr923847/cbord.git`
- copy `exampledotenv.txt` into a `.env` file and change values as needed.
- p.s. node `v24.5.0` and npm `11.5.1`

Run `npm install` to install dependencies.

Run `npm run build` to build `/src` to `/dist`, and `npm start` to start the server.
(On Windows, use `npm run buildw`)

If you are using https locally, run these commands in root to add local certs:
```
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem
```
