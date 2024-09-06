import pool from "../database/db";

interface UserCreate {
  name: string;
  email: string;
  password: string;
}

interface UserOutput {
  id: number;
  name: string;
  email: string;
}

interface UserOutputWithPassword {
  id: number;
  name: string;
  email: string;
  password: string;
}

const userModel = {
  async create({ name, email, password }: UserCreate): Promise<UserOutput> {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const id = (result as any).insertId;
    return { id, name, email };
  },

  async findByEmail(email: string): Promise<UserOutput | null> {
    const [result] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    );

    return (result as any)[0] || null;
  },

  async findByEmailWithPassword(
    email: string
  ): Promise<UserOutputWithPassword | null> {
    const [result] = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );

    return (result as any)[0] || null;
  },

  async findById(id: number): Promise<UserOutput | null> {
    const [result] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    );

    return (result as any)[0] || null;
  },

  async update(id: number, name: string, email: string): Promise<void> {
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id,
    ]);
  },

  async delete(id: number): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  },

  async findAll(): Promise<UserOutput[]> {
    const [result] = await pool.query("SELECT id, name, email FROM users");

    return result as any;
  },
};

export default userModel;
