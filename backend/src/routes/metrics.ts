import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// GET /api/metrics — List all metrics (with optional limit)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const result = await query(
      'SELECT * FROM metrics ORDER BY timestamp DESC LIMIT $1',
      [limit]
    );
    res.json({ metrics: result.rows });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// POST /api/metrics — Create a new metric
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, value, unit, source, timestamp } = req.body;
    
    if (!name || value === undefined) {
      return res.status(400).json({ error: 'Name and value are required' });
    }

    const result = await query(
      `INSERT INTO metrics (name, value, unit, source, timestamp) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, value, unit || null, source || null, timestamp || new Date().toISOString()]
    );

    res.status(201).json({ metric: result.rows[0] });
  } catch (error) {
    console.error('Error creating metric:', error);
    res.status(500).json({ error: 'Failed to create metric' });
  }
});

export default router;
