import {
  CollaborativeWorkspaceDto,
  PresenceUserDto,
  SharedNoteDto,
} from '@codeforge/shared';

export class CollaborationPlatformService {
  private workspaces: Map<string, CollaborativeWorkspaceDto> = new Map();
  private presenceMap: Map<string, PresenceUserDto[]> = new Map();
  private notesMap: Map<string, SharedNoteDto[]> = new Map();

  async createWorkspace(ownerId: string, name: string): Promise<CollaborativeWorkspaceDto> {
    const id = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ws: CollaborativeWorkspaceDto = {
      id,
      name,
      ownerId,
      memberIds: [ownerId],
      activeAgentIds: [],
      livePresence: [],
      sharedNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workspaces.set(id, ws);
    return ws;
  }

  async getWorkspace(id: string): Promise<CollaborativeWorkspaceDto | null> {
    const ws = this.workspaces.get(id);
    if (!ws) return null;

    ws.livePresence = this.presenceMap.get(id) || [];
    ws.sharedNotes = this.notesMap.get(id) || [];
    return ws;
  }

  async listWorkspacesForUser(userId: string): Promise<CollaborativeWorkspaceDto[]> {
    return Array.from(this.workspaces.values()).filter(ws => ws.memberIds.includes(userId));
  }

  async addMember(workspaceId: string, userId: string): Promise<CollaborativeWorkspaceDto> {
    const ws = this.workspaces.get(workspaceId);
    if (!ws) throw new Error('Workspace not found');

    if (!ws.memberIds.includes(userId)) {
      ws.memberIds.push(userId);
      ws.updatedAt = new Date().toISOString();
    }
    return ws;
  }

  async updatePresence(workspaceId: string, user: { userId: string; username: string; currentView: string }): Promise<PresenceUserDto[]> {
    const list = this.presenceMap.get(workspaceId) || [];
    const existingIndex = list.findIndex(p => p.userId === user.userId);

    const presenceItem: PresenceUserDto = {
      userId: user.userId,
      username: user.username,
      currentView: user.currentView,
      lastActiveAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = presenceItem;
    } else {
      list.push(presenceItem);
    }

    this.presenceMap.set(workspaceId, list);
    return list;
  }

  async getPresenceList(workspaceId: string): Promise<PresenceUserDto[]> {
    return this.presenceMap.get(workspaceId) || [];
  }

  async addSharedNote(workspaceId: string, authorId: string, content: string): Promise<SharedNoteDto> {
    const notes = this.notesMap.get(workspaceId) || [];
    const note: SharedNoteDto = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };

    notes.push(note);
    this.notesMap.set(workspaceId, notes);
    return note;
  }

  async listSharedNotes(workspaceId: string): Promise<SharedNoteDto[]> {
    return this.notesMap.get(workspaceId) || [];
  }
}
