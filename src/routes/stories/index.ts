import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({}) => {
  const stories = await db.story.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  return {
    body: {
      stories,
    },
  };
};
