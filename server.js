
import 'dotenv/config';
import express from 'express';
import { prisma } from './lib/prisma.js'; // Adjusted path
import { z, ZodError } from 'zod';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// --- START: Added for production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));
// --- END: Added for production ---


app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const fuelLogSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	liters: z.number(),
	priceTotalLiter: z.number(),
	odometer: z.number(),
});
// Middleware de validation
function validateFuelLog(req, res, next) {
	try {
		fuelLogSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof ZodError) {
			const [errorMessage] = error.issues.map((issue) => {
				return `${issue.path[0]} ${issue.message}`;
			});
			return res.status(400).json({ error: errorMessage });
		}
		next(error);
	}
}
// Get all fuel logs
app.get('/api/fuel-logs', async (req, res) => {
	try {
		const fuelLogs = await prisma.rawFuelEntry.findMany({
			orderBy: {
				odometer: 'asc',
			},
		});
		res.json(fuelLogs);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while fetching fuel logs.' });
	}
});

// Add a new fuel log
app.post('/api/fuel-logs', validateFuelLog, async (req, res) => {
	try {
		const { date, liters, priceTotalLiter, odometer } = req.body;
		const newLog = await prisma.rawFuelEntry.create({
			data: {
				date: new Date(date),
				liters,
				priceTotalLiter,
				odometer,
			},
		});
		res.status(201).json(newLog);
	} catch (error) {
		console.error('Error creating fuel log:', error);
		res.status(500).json({ error: 'An error occurred while creating the fuel log.' });
	}
});

// Delete a fuel log
app.delete('/api/fuel-logs/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.rawFuelEntry.delete({
			where: { id: Number(id) },
		});
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting fuel log:', error);
		res.status(500).json({ error: 'An error occurred while deleting the fuel log.' });
	}
});

// --- START: Added for production ---
// For any other request, serve the index.html file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
// --- END: Added for production ---


app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
