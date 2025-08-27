import { Request } from 'express';
import config from '../config';
import '../types/session';

export async function verifyAuth(req: Request): Promise<boolean> {
  if (
    (req.method == 'GET' &&
      req.query.usr &&
      req.query.token &&
      req.query.state &&
      req.session.state) ||
    req.session.auth
  ) {
    // check if relevant url/cookie params exist
    if (req.session.auth) {
      return true;
    } else {
      console.log('authing through portal redirect');
      const user = req.query.usr; // get username param
      const token = req.query.token; // get auth token param

      if (req.query.state != req.session.state) {
        // check that state matches
        req.session.auth = false; // sets session param 'auth' to false
        return false; // return, end authentication
      }

      const myst_endpoint = 'https://mystauth.com/api/v1/user/token/verify/'; // Myst Auth Token verify endpoint

      const myst_id = config.auth.api_id; // get api id
      const myst_api_key = config.auth.api_key; // get api key

      const myst_params = {
        // POST parameters
        id: myst_id, // your API id, best to retrieve from environment variable or secrets file
        apiKey: myst_api_key, // your API key, best to retrieve from environment variable or secrets file
        usr: user,
        token: token,
      };

      // make API call, pass params
      const auth = await fetch(myst_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(myst_params),
      });

      const authData = await auth.json(); // get json

      const authenticated = authData.success; // gets 'success' field from json

      if (authenticated) {
        // checks if 'success': true, token was verified
        req.session.usr = user as string;
        req.session.auth = true; // sets request param 'authenticated' to True
        return true;
      }
    }
  }

  return false;
}
