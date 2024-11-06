import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db',
});

export const db = {
  // ... existing methods ...

  async updateEvent(id: string, updates: Partial<Event>) {
    const sets = Object.entries(updates)
      .map(([key]) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    const result = await client.execute({
      sql: `UPDATE events SET ${sets} WHERE id = ? RETURNING *`,
      args: [...values, id]
    });
    return result.rows[0];
  },

  async deleteEvent(id: string) {
    await client.execute({
      sql: 'DELETE FROM events WHERE id = ?',
      args: [id]
    });
  }
};

export type { Item, Event, ChecklistTemplate } from '../types';