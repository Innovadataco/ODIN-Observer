import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// GET /api/events — List events with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, severity, limit = '100', offset = '0' } = req.query;
    
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (severity) {
      sql += ` AND severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json({ events: result.rows });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events — Create a new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, severity, message, metadata } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const result = await query(
      `INSERT INTO events (type, severity, message, metadata) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [type, severity || 'info', message, metadata ? JSON.stringify(metadata) : null]
    );

    res.status(201).json({ event: result.rows[0] });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
