#!/usr/bin/env tsx

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SLACK_BOT_TOKEN) {
  console.error('SLACK_BOT_TOKEN is not set');
  process.exit(1);
}

if (!process.env.SLACK_USER_TOKEN) {
  console.error('SLACK_USER_TOKEN is not set');
  process.exit(1);
}

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const userClient = new WebClient(process.env.SLACK_USER_TOKEN);

async function findUserByName(name: string): Promise<string | null> {
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 5;

  while (pageCount < maxPages) {
    const response = await slackClient.users.list({
      limit: 1000,
      cursor,
    });

    if (!response.ok) {
      throw new Error(`Failed to get users: ${response.error}`);
    }

    if (response.members) {
      const searchTerm = name.toLowerCase();
      const user = response.members.find((u: any) => {
        const userName = u.name?.toLowerCase() || '';
        const realName = u.real_name?.toLowerCase() || '';
        const displayName = u.profile?.display_name?.toLowerCase() || '';
        const displayNameNormalized =
          u.profile?.display_name_normalized?.toLowerCase() || '';

        return (
          userName.includes(searchTerm) ||
          realName.includes(searchTerm) ||
          displayName.includes(searchTerm) ||
          displayNameNormalized.includes(searchTerm)
        );
      });

      if (user && user.id) {
        return user.id;
      }
    }

    cursor = response.response_metadata?.next_cursor;
    pageCount++;

    if (!cursor) break;
  }

  return null;
}

async function getActivitySummary(userId: string, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;

  console.log(`\n🔍 Searching for messages from user ${userId}`);
  console.log(`📅 Period: ${startDate} to ${endDate}\n`);

  let allMessages: any[] = [];
  let page = 1;
  const maxPages = 10; // Limit to prevent too many requests

  while (page <= maxPages) {
    const query = `from:<@${userId}> after:${startDate} before:${endDate}`;
    console.log(`Searching page ${page}...`);

    const response = await userClient.search.messages({
      query: query,
      count: 100,
      page: page,
      sort: 'timestamp',
      sort_dir: 'desc',
    });

    if (!response.ok) {
      throw new Error(`Failed to search messages: ${response.error}`);
    }

    if (response.messages?.matches) {
      const messages = response.messages.matches;
      allMessages.push(...messages);

      console.log(`  Found ${messages.length} messages on page ${page}`);

      // Check if there are more pages
      const totalPages = response.messages.pagination?.page_count || 1;
      if (page >= totalPages) {
        break;
      }
      page++;
    } else {
      break;
    }
  }

  return allMessages;
}

async function formatSummary(messages: any[], userId: string) {
  // Get user info
  const userInfo = await slackClient.users.info({ user: userId });
  const userName =
    userInfo.user?.real_name || userInfo.user?.name || 'Unknown User';

  console.log('\n' + '='.repeat(80));
  console.log(`📊 Activity Summary for ${userName}`);
  console.log('='.repeat(80));

  // Group messages by channel
  const messagesByChannel: { [key: string]: any[] } = {};
  for (const msg of messages) {
    const channelName = msg.channel?.name || 'Unknown Channel';
    if (!messagesByChannel[channelName]) {
      messagesByChannel[channelName] = [];
    }
    messagesByChannel[channelName].push(msg);
  }

  console.log(`\n📝 Total Messages: ${messages.length}`);
  console.log(`📁 Channels: ${Object.keys(messagesByChannel).length}\n`);

  // Show messages by channel
  for (const [channelName, channelMessages] of Object.entries(
    messagesByChannel
  )) {
    console.log(`\n# ${channelName} (${channelMessages.length} messages)`);
    console.log('-'.repeat(80));

    // Sort by timestamp (newest first)
    channelMessages.sort((a, b) => {
      const tsA = parseFloat(a.ts || '0');
      const tsB = parseFloat(b.ts || '0');
      return tsB - tsA;
    });

    for (const msg of channelMessages.slice(0, 10)) {
      // Show top 10 messages per channel
      const date = msg.ts
        ? new Date(parseFloat(msg.ts) * 1000).toLocaleString('ja-JP')
        : 'Unknown date';
      const text = msg.text?.substring(0, 100) || '(no text)';
      const permalink = msg.permalink || '';

      console.log(`\n  📅 ${date}`);
      console.log(`  💬 ${text}${text.length >= 100 ? '...' : ''}`);
      if (permalink) {
        console.log(`  🔗 ${permalink}`);
      }
    }

    if (channelMessages.length > 10) {
      console.log(
        `  ... and ${channelMessages.length - 10} more messages in this channel`
      );
    }
  }

  // Statistics
  console.log('\n' + '='.repeat(80));
  console.log('📈 Statistics');
  console.log('='.repeat(80));

  const channelStats = Object.entries(messagesByChannel)
    .map(([name, msgs]) => ({ name, count: msgs.length }))
    .sort((a, b) => b.count - a.count);

  console.log('\nTop Channels by Message Count:');
  channelStats.slice(0, 10).forEach((stat, index) => {
    console.log(`  ${index + 1}. #${stat.name}: ${stat.count} messages`);
  });
}

async function main() {
  try {
    const searchName = 'Kohei Tokida';
    console.log(`🔍 Searching for user: ${searchName}...`);

    const userId = await findUserByName(searchName);

    if (!userId) {
      console.error(`❌ User "${searchName}" not found`);
      process.exit(1);
    }

    console.log(`✅ Found user ID: ${userId}`);

    const messages = await getActivitySummary(userId, 2026, 1);

    if (messages.length === 0) {
      console.log('\n📭 No messages found for the specified period.');
      return;
    }

    await formatSummary(messages, userId);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
