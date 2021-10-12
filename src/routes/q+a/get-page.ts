import { databaseReady, QuestionModel } from '$lib/db';
import { Question } from '$lib/structures';
import { RequestHandler } from '@sveltejs/kit';

const PAGE_SIZE = 25;

export const get: RequestHandler = async ({ query }) => {
  await databaseReady();

  const count = await QuestionModel.countDocuments();
  const lastPage = Math.floor(count / PAGE_SIZE) - 1;
  const pageNumber = parseInt(query.get('page') ?? '0');

  if (pageNumber >= lastPage) {
    return {
      body: {
        tooNew: true,
      },
    };
  }

  const questions = await QuestionModel.find({})
    .sort({ date: 1, d: 1 })
    .skip(pageNumber * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .exec();

  return {
    body: {
      page: pageNumber,
      questions: questions
        .reverse()
        .map((q) => Question.fromJSON(JSON.parse(JSON.stringify(q))).toJSON()) as any,
    },
  };
};
