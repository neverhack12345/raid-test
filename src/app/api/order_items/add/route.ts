import { NextResponse, NextRequest } from "next/server";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function POST(req: NextRequest, res) {
  try {
    const payload = await req.json()
    const order = payload.data.insertId
    const cart = payload.cart
    console.log(order)
    console.log(cart)
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });
    await db.exec('BEGIN'); // Start a transaction
    const stmt = await db.prepare('INSERT INTO order_items ("order", product, qty, itemCost, gCost) VALUES (?, ?, ?, ?, ?)');
    for (const key of Object.keys(cart)) {
      const { id, name, itemCost, gCost, qty } = cart[key]; 
      await stmt.run(order, id, qty, itemCost, gCost); 
    }
    await stmt.finalize(); // Finalize the prepared statement
    await db.exec('COMMIT'); // Commit the transaction
    return NextResponse.json({})
  } catch (error) {
    return NextResponse.error()
  }
}