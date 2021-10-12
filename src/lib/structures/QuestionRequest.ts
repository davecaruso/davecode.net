import { schema } from '.';
import { Data, JSONData } from './structure-utils';

@schema('question-requests')
export class QuestionRequest {
  date: Date;
  content: string;
  notificationEmail: string | undefined;

  constructor(data?: Data<QuestionRequest>) {
    this.date = data.date;
    this.content = data.content;
  }

  toJSON(): JSONData<QuestionRequest> {
    return {
      date: this.date.toISOString(),
      content: this.content,
      notificationEmail: this.notificationEmail,
    };
  }

  static fromJSON(data: JSONData<QuestionRequest>) {
    return new QuestionRequest({
      date: new Date(data.date),
      content: data.content,
      notificationEmail: data.notificationEmail,
    });
  }

  setDate(date: Date) {
    this.date = date;
    return this;
  }

  setContent(content: string) {
    this.content = content;
    return this;
  }

  setNotificationEmail(notificationEmail: string | undefined) {
    this.notificationEmail = notificationEmail;
    return this;
  }
}
