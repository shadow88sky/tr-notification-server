export interface TwitterOptions {
  /** "api" is the default (change for other subdomains) */
  subdomain?: string;
  /** version "1.1" is the default (change for other subdomains) */
  version?: string;
  /** version "2" does not use .json for endpoints, defaults to true */
  extension?: boolean;
  /** consumer key from Twitter. */
  consumer_key: string;
  /** consumer secret from Twitter */
  consumer_secret: string;
  /** access token key from your User (oauth_token) */
  access_token_key?: OauthToken;
  /** access token secret from your User (oauth_token_secret) */
  access_token_secret?: OauthTokenSecret;
  /** bearer token */
  bearer_token?: string;
}

type OauthToken = string;
type OauthTokenSecret = string;
