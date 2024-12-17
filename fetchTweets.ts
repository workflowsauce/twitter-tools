import axios from 'axios';
import {config} from 'dotenv-safe';
config();


interface Tweet {
  tweet_created_at: string;
  id: number;
  id_str: string;
  text: string | null;
  full_text: string;
  source: string;
  truncated: boolean;
  in_reply_to_status_id: number | null;
  in_reply_to_status_id_str: string | null; 
  in_reply_to_user_id: number | null;
  in_reply_to_user_id_str: string | null;
  in_reply_to_screen_name: string | null;
  user: {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    url: string | null;
    description: string;
    protected: boolean;
    verified: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    favourites_count: number;
    statuses_count: number;
    created_at: string;
    profile_banner_url: string;
    profile_image_url_https: string;
    can_dm: boolean;
  };
  quoted_status_id: number | null;
  quoted_status_id_str: string | null;
  is_quote_status: boolean;
  quoted_status: Tweet | null;
  retweeted_status: Tweet | null;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  views_count: number;
  bookmark_count: number;
  lang: string;
  entities: {
    hashtags: any[];
    symbols: any[];
    timestamps: any[];
    urls: any[];
    user_mentions: Array<{
      id_str: string;
      indices: number[];
      name: string;
      screen_name: string;
    }>;
    media?: Array<{
      display_url: string;
      expanded_url: string;
      ext_media_availability?: {
        status: string;
      };
      features?: {
        large: {
          faces: Array<{
            h: number;
            w: number;
            x: number;
            y: number;
          }>;
        };
      };
      id_str: string;
      indices: number[];
      media_key: string;
      media_url_https: string;
      original_info: {
        focus_rects: Array<{
          h: number;
          w: number;
          x: number;
          y: number;
        }>;
        height: number;
        width: number;
      };
      sizes: {
        large: {
          h: number;
          w: number;
        };
      };
      type: string;
      url: string;
    }>;
  };
  is_pinned: boolean;
}

interface TweetsResponse {
  tweets: Tweet[];
  next_cursor?: string;
}

async function getUserId(username: string): Promise<string> {
  console.log(`Getting user ID for ${username}...`);
  const response = await axios.get(`https://api.socialdata.tools/twitter/user/${username}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SOCIAL_DATA_API_KEY}`
    }
  });
  console.log(`Found user ID: ${response.data.id_str}`);
  return response.data.id_str;
}

export async function fetchTweets(username: string, count = 50): Promise<Tweet[]> {
  const userId = await getUserId(username);
  const tweets: Tweet[] = [];
  let cursor: string | undefined;

  console.log(`Fetching up to ${count} tweets...`);

  while (tweets.length < count) {
    const url = `https://api.socialdata.tools/twitter/user/${userId}/tweets-and-replies${cursor ? `?cursor=${cursor}` : ''}`;
    console.log(`Fetching batch of tweets${cursor ? ` with cursor ${cursor}` : ''}...`);
    
    const response = await axios.get<TweetsResponse>(url, {
      headers: {
        'Authorization': `Bearer ${process.env.SOCIAL_DATA_API_KEY}`
      }
    });

    tweets.push(...response.data.tweets.filter(tweet => tweet.user?.id_str === userId));
    cursor = response.data.next_cursor;
    
    console.log(`Retrieved ${response.data.tweets.length} tweets (total: ${tweets.length})`);

    if (!cursor) {
      console.log('No more tweets available');
      break;
    }
  }

  const finalTweets = tweets.slice(0, count);
  console.log(`Returning ${finalTweets.length} tweets`);
  return finalTweets;
}