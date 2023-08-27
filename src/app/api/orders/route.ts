import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function GET() {
    try {
        const db = await open({
          filename: './database.db',
          driver: sqlite3.Database,
        });
        const query = 'SELECT * FROM orders'; 
        const products = await db.all(query);
        return NextResponse.json(products)
      } catch (error) {
        return NextResponse.error()
      }
}