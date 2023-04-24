/* 
  id: UUID,
  title: string,
  description: string,
  completed_at: serverCreated ==> inital value "null"
  created_at: serverCreated
  updated_ad: serverCreated
*/

import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((data) => data.id === id);

    if (rowIndex > -1) {
      const oldData = this.#database[table][rowIndex];
      const {
        title: oldTitle,
        description: oldDescription,
        completed_at,
        created_at,
      } = oldData;

      const newData = {
        id,
        title: data.title ?? oldTitle,
        description: data.description ?? oldDescription,
        completed_at,
        created_at,
        updated_at: new Date(),
      };

      this.#database[table][rowIndex] = { id, ...newData };
      this.#persist();
    }
  }

  delete(table, id) {
    const existsData = this.#database[table].findIndex((data) => data.id === id);

    if (existsData > -1) {
      // -1 === not found in array (because of function .findIndex)
      const newDatabase = this.#database[table].filter((data) => data.id !== id);

      this.#database[table] = newDatabase;
      this.#persist();
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex((data) => data.id === id);

    if (rowIndex > -1) {
      const oldData = this.#database[table][rowIndex];

      const { completed_at: oldCompleted_at } = oldData;

      const newData = {
        ...oldData,
        completed_at: oldCompleted_at ? null : new Date(),
        updated_at: new Date(),
      };

      this.#database[table][rowIndex] = newData;
      this.#persist();
    }
  }
}
