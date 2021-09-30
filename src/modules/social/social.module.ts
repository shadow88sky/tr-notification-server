import { Module } from '@nestjs/common';
import { TwitterModule } from './twitter/twitter.module';
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
  ],
  providers: [],
})
export class SocialModule {}
