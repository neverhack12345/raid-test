import { NextResponse, NextRequest } from "next/server";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function POST(req: NextRequest, res) {
    try {
      const payload = await req.json()
      const db = await open({
        filename: './database.db',
        driver: sqlite3.Database,
      });
      const query = `INSERT INTO orders (totalCost, orderTime) VALUES (?, datetime('now', 'localtime'))`; 
      const result = await db.run(query, String(payload));
      const insertId = result.lastID; // Get the insert ID
      console.log(insertId)
      return NextResponse.json({"insertId": insertId})
    } catch (error) {
      return NextResponse.error()
    }
}