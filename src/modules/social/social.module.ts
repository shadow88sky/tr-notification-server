import { Module } from '@nestjs/common';
import Agent from 'socks5-https-client/lib/Agent';
import { TwitterModule } from './twitter';
import { TelegramModule, TelegramService } from './telegram';
import { ConfigModule, ConfigService } from '../config';
@Module({
  imports: [
    TwitterModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        subdomain: config.get('TWITTER_SUBDOMAIN'), // "api" is the default (change for other subdomains)
        version: config.get('TWITTER_VERSION'), // version "1.1" is the default (change for other subdomains)
        consumer_key: config.get('TWITTER_CONSUMER_KEY'), // from Twitter.
        consumer_secret: config.get('TWITTER_CONSUMER_SECRET'), // from Twitter.
        access_token_key: config.get('TWITTER_ACCESS_TOKEN_KEY'), // from your User (oauth_token)
        access_token_secret: config.get('TWITTER_ACCESS_TOKEN_SECRET'), // from your User (oauth_token_secret)
      }),
      inject: [ConfigService],
    }),
    TelegramModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => {
        if (config.get('SOCKS_HOST') && config.get('SOCKS_PORT')) {
          return {
            token: config.get('TELEGRAM_TOKEN'),
            options: {
              polling: true,
              request: {
                agentClass: Agent,
                agentOptions: {
                  socksHost: config.get('SOCKS_HOST'),
                  socksPort: config.get('SOCKS_PORT'),
                  // If authorization is needed:
                  // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
                  // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
                },
              },
            },
          };
        }

        return {
          token: config.get('TELEGRAM_TOKEN'),
          options: {
            polling: true,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class SocialModule {}
