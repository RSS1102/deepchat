import { BaseTable } from './baseTable'
import type Database from 'better-sqlite3-multiple-ciphers'

export type GroupRow = {
  id: number
  name: string
  created_at: number
  updated_at: number
}

export class GroupsTable extends BaseTable {
  constructor(db: Database.Database) {
    super(db, 'groups')
  }

  getCreateTableSQL(): string {
    return `
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX idx_groups_created ON groups(created_at DESC);
    `
  }

  getMigrationSQL(_version: number): string | null {
    return null
  }

  getLatestVersion(): number {
    return 0
  }

  createTable(): void {
    if (!this.tableExists()) {
      this.db.exec(this.getCreateTableSQL())
    }
  }

  insert(name: string): number {
    const now = Date.now()
    const stmt = this.db.prepare(
      'INSERT INTO groups (name, created_at, updated_at) VALUES (?, ?, ?)' 
    )
    const info = stmt.run(name, now, now)
    return info.lastInsertRowid as number
  }

  getAll(): GroupRow[] {
    return this.db.prepare('SELECT * FROM groups ORDER BY created_at DESC').all() as GroupRow[]
  }

  update(id: number, name: string): void {
    const now = Date.now()
    this.db.prepare('UPDATE groups SET name = ?, updated_at = ? WHERE id = ?').run(name, now, id)
  }

  delete(id: number): void {
    this.db.prepare('DELETE FROM groups WHERE id = ?').run(id)
  }
}
