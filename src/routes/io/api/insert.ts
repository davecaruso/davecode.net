import { db } from "$lib/db";
import type { Message } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit"
import type { ASTNode } from "svelte-simple-markdown";
import { messageMarkdown } from '../_lib/markdown';
import { parseMessageDateID } from "../_lib/utils";

function walkAst(astNode: ASTNode) {
  if (Array.isArray(astNode.content)) {
    return astNode.content.map(walkAst).flat();
  } else if (astNode.type === 'mentionArtifact') {
    return [{ artifact: astNode.id }];
  } else if (astNode.type === 'mentionMessage') {
    return [{ message: astNode.id }];
  } else return [];
}

export const post: RequestHandler = async ({ locals, request }) => {
  locals.assertAuthorized();

  const body: Message = await request.json();
  body.date = new Date(body.date);
  body.text = body.text ?? '';

  const parsed = messageMarkdown.parser(body.text);
  const mentions = walkAst({ type: 'document', content: parsed });
  const mentionedMessages = mentions.filter(m => m.message).map(m => ({ date: parseMessageDateID(m.message) }));
  const mentionedArtifacts = mentions.filter(m => m.artifact).map(m => ({ id: m.artifact }));

  db.$transaction([
    db.message.upsert({
      where: {
        date: body.date,
      },
      create: {
        ...body,
        mentionedMessages: {
          connect: mentionedMessages
        },
        mentionedArtifacts: {
          connect: mentionedArtifacts
        }
      },
      update: {
        ...body,
        mentionedMessages: {
          connect: mentionedMessages
        },
        mentionedArtifacts: {
          connect: mentionedArtifacts
        }
      },
    }),
    db.messageInput.deleteMany({
      where: {
        date: body.date,
      },
    })
  ]);


  return {
    body: { ok: true },
  }
}