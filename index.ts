import { fetchTweets } from './fetchTweets';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const [username, countStr] = process.argv.slice(2);
  const count = countStr ? parseInt(countStr) : 50;

  if (!username) {
    console.error('Usage: node index.js <username> [count]');
    process.exit(1);
  }

  const tweets = await fetchTweets(username, count);
  const date = new Date().toISOString().split('T')[0];
  
  // Save as JSON
  await fs.writeFile(
    path.join(process.cwd(), `${username}-${date}.json`),
    JSON.stringify(tweets, null, 2)
  );

  // Save as markdown
  const markdown = tweets.map(tweet => {
    let text = tweet.full_text;
    if (tweet.quoted_status) {
      text += '\n\n' + tweet.quoted_status.full_text.split('\n')
        .map(line => `> ${line}`)
        .join('\n');
    }
    return text;
  }).join('\n\n---\n\n');

  await fs.writeFile(
    path.join(process.cwd(), `${username}-${date}.md`),
    `${username} - ${date}\n\n${markdown}`
  );
}

main().catch(console.error);