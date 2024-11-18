import { Request, Response } from "express";
import pool from "../db/database";

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
];

// GET /users
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rows } = await pool.query(`SELECT * FROM users`);
    return res.json(rows);
  } catch (err) {
    console.error(`Error fetching the users ${err}`);
    return res.status(500).json({ message: `Internal server error` });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    if (rows.length === 0) {
      return res.json(`User not found`);
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(`Error fetching the users ${err}`);
    return res.status(500).json({ message: `Internal server error` });
  }
};

// POST /users
export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
      [name, email]
    );
    return res.status(201).json(rows);
  } catch (err) {
    console.error(`Error fetching the users ${err}`);
    return res.status(500).json({ message: `Internal server error` });
  }
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING * `,
      [name, email, id]
    );
    if (rows.length === 0) {
      return res.json(`User not found`);
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(`Error fetching the users ${err}`);
    return res.status(500).json({ message: `Internal server error` });
  }
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.json(`User not found`);
    }
    return res.json(`User with id : ${id} have been deleted`);
  } catch (err) {
    console.error(`Error fetching the users ${err}`);
    return res.status(500).json({ message: `Internal server error` });
  }
};
