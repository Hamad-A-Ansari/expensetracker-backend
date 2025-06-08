import express from 'express';
import { sql } from '../config/db.js';


const router = express.Router();

//GET a Transaction by User ID
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC;
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Add a Transaction
router.post("/", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;  

    // Validate required fields
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//DELETE a Transaction by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate Transaction ID is a number
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid transaction ID' });
  }


  try {
    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Summary of Transactions
router.get("/summary/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${user_id};
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${user_id} AND amount > 0;
    `;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense
      FROM transactions
      WHERE user_id = ${user_id} AND amount < 0;
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;