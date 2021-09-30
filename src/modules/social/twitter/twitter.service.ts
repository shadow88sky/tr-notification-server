import { Inject, Injectable } from '@nestjs/common';
import { TwitterOptions } from './twitter-options.interface';
import { TWITTER_OPTIONS } from './twitter.constants';
import Twitter from 'twitter-lite';

@Injectable()
export class TwitterService {
  private client: Twitter;
  constructor(
    @Inject(TWITTER_OPTIONS) private readonly twitterOptions: TwitterOptions,
  ) {
    this.client = new Twitter(twitterOptions);
    console.log('this.client', this.client);
  }

  async sendTweet() {
    // const tweet = await client.post("statuses/update", {
    //     status: status,
    //     in_reply_to_status_id: lastTweetID,
    //     auto_populate_reply_metadata: true
    //   });
    //   lastTweetID = tweet.id_str;
  }
}
