import { Inject, Injectable } from '@nestjs/common';
import { TwitterOptions } from './twitter-options.interface';
import { TWITTER_OPTIONS } from './twitter.constant';
import Twitter from 'twitter-lite';

@Injectable()
export class TwitterService {
  private client: Twitter;
  constructor(
    @Inject(TWITTER_OPTIONS) private readonly twitterOptions: TwitterOptions,
  ) {
    this.client = new Twitter(twitterOptions);
  }

  async post<T = any>(resource: string, body: object): Promise<T> {
    return this.client.post(resource, body);
  }
}
