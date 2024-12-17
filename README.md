# Twitter Tools

Simple tools to work with tweets.

Prerequisites:
 - [Node.js](https://nodejs.org/en)
 - [SocialData.io](https://socialdata.tools/) API key

Get started:
1. Clone this repository
2. Install dependencies: `npm install`
3. Copy the `.env.example` file as `.env` and add the API key to it


## fetchTweets

This one is simple. Give it a username and a count, and it will fetch tweets for any user in JSON and markdown format.

To run, just do `npx ts-node . workflowsauce 100`

Then, take the file and drop it into your favorite LLM and ask for insights!


**Note:** The output doesn't seem to clearly embed quote tweets, so it may need some massaging. Take a look and submit a PR if you have a fix in mind. It seemed to work well enough for [my use case](https://x.com/workflowsauce/status/1860012617978532042).

P.S. This repo was written with Sonnet's help, in Cursor! Check instructions.txt to see how it started! (And if you like this approach, try it, too! We might be able to normalize [sharing prompts like this](https://x.com/workflowsauce/status/1850986806835392695).)
