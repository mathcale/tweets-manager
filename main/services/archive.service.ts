import { readFile } from 'fs/promises';
import TwitterArchive from 'twitter-archive-reader';

interface BadTweet {
  id: string;
  createdAt: string;
  fullText: string;
  user: string;
}

class ArchiveService {
  private dictionary = [];
  private badTweets: BadTweet[];

  public getBadTweets(): any {
    return this.badTweets;
  }

  public async analyze(archivePath: string): Promise<any | never> {
    const archive = await this.parse(archivePath);

    if (this.dictionary.length === 0) {
      throw new Error('Dictionary not loaded!');
    }

    const badTweets = archive.tweets.all.filter((tweet) =>
      tweet.full_text.match(this.parseDictionaryEntriesToRegex(this.dictionary))
    );

    console.info(
      `Found [${badTweets.length}] bad tweets on a total of [${archive.tweets.length}]!`
    );

    const badTweetsJson: BadTweet[] = badTweets.map((tweet) => ({
      id: tweet.id_str,
      createdAt: tweet.created_at,
      fullText: tweet.full_text,
      user: tweet.user.screen_name,
    }));

    this.badTweets = badTweetsJson;

    return this.badTweets;
  }

  private async parse(archivePath: string): Promise<TwitterArchive | never> {
    console.log('[ArchiveService.parse] Reading file from filesystem...');

    const archiveFile = await readFile(archivePath);

    console.log('[ArchiveService.parse] Parsing archive file...');

    const archive = new TwitterArchive(archiveFile);
    await archive.ready();

    console.log(
      `[ArchiveService.parse] Archive is ready! Total tweets: [${archive.tweets.length}]`
    );

    return archive;
  }

  private parseDictionaryEntriesToRegex(dictionary: string[]) {
    return new RegExp(dictionary.join('|'), 'gi');
  }
}

export default new ArchiveService();
