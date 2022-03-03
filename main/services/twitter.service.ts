import dotenv from 'dotenv';
import Twitter from 'twitter';

dotenv.config({ path: `${process.cwd()}/.env` });

class TwitterError extends Error {
  constructor(private code: number, private remoteMessage: string) {
    super();

    this.name = TwitterError.name;
    this.code = code;
    this.message = remoteMessage;
  }
}

class TwitterService {
  private client: Twitter;

  constructor() {
    console.log(process.env.TWITTER_CONSUMER_KEY);
    console.log(process.env.TWITTER_CONSUMER_SECRET);
    console.log(process.env.TWITTER_ACCESS_TOKEN_KEY);
    console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET);

    this.client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  public async deleteTweet(tweetId: string): Promise<void | never> {
    try {
      const result = await this.client.post('/statuses/destroy', { id: tweetId });
      console.log(JSON.stringify(result));

      console.info(`[TwitterService.deleteTweet] Tweet with id ${tweetId} successfully deleted!`);
    } catch (err) {
      console.error(`[TwitterService.deleteTweet] Error for id ${tweetId}: ${JSON.stringify(err)}`);

      throw new TwitterError(err[0].code, err[0].message);
    }
  }
}

export default new TwitterService();
