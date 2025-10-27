const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;
  const userId = req.user.id; // assuming you're using auth middleware

  try {
    const newExpense = new Expense({
      userId,
      description,
      amount,
      category,
      date
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving expense' });
  }
};
