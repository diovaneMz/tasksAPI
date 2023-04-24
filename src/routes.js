import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const data = database.select("tasks");

      res.writeHead(200).end(JSON.stringify(data));
    },
  },
  {
    method: "POST",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const date = new Date();
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: date,
        update_at: date,
      };

      database.insert("tasks", task);

      res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const data = {
        title: title ?? null,
        description: description ?? null,
      };

      database.update("tasks", id, data);

      res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);
      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    url: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      database.complete("tasks", id);

      res.writeHead(204).end();
    },
  },
];
