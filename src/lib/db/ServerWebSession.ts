import { JSONData, Permission, User, WebSession, WebSessionUser } from '$lib/structures';
import { getDatabase } from '.';

export class ServerWebSession extends WebSession {
  userIsUpToDate = false;
  private serverUser?: User;

  static fromJSON(json: JSONData<WebSession>) {
    const x = WebSession.fromJSON(json);
    (x as any).__proto = ServerWebSession.prototype;
    return x as ServerWebSession;
  }

  static get destroyedSession() {
    const x = WebSession.destroyedSession;
    (x as any).__proto = ServerWebSession.prototype;
    return x as ServerWebSession;
  }

  async updateUserMeta() {
    if (this.user) {
      const db = await getDatabase(User);
      const user = await db.findOne({ id: this.user.id });
      if (user) {
        this.user = WebSessionUser.fromUser(User.fromJSON(user));
        this.serverUser = User.fromJSON(user);
      }
    }
  }

  async ensureUpToDate() {
    if (!this.userIsUpToDate) {
      await this.updateUserMeta();
      this.userIsUpToDate = true;
    }
  }

  async getServerUser() {
    await this.ensureUpToDate();
    return this.serverUser;
  }

  async queryPermission(permission: Permission) {
    await this.ensureUpToDate();
    return this.user && this.user.permissions.has(permission);
  }

  logout() {
    this.user = undefined;
    this.userIsUpToDate = false;
    this.serverUser = undefined;
  }

  toWebSession() {
    return new WebSession(this);
  }
}
