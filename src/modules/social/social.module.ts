import { Module } from '@nestjs/common';
import { TwitterModule } from './twitter/twitter.module';
import { ConfigModule, ConfigService } from '../config';
@Module({
  imports: [
    TwitterModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        subdomain: 'string', // "api" is the default (change for other subdomains)
        version: 'string', // version "1.1" is the default (change for other subdomains)
        consumer_key: 'string', // from Twitter.
        consumer_secret: 'string', // from Twitter.
        access_token_key: 'string', // from your User (oauth_token)
        access_token_secret: 'string', // from your User (oauth_token_secret)
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class SocialModule {}
