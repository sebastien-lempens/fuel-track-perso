// FIX: Add imports for Vitest globals to resolve TypeScript errors.
import { describe, it, expect } from 'vitest';
import { FuelLog } from '../FuelLog';
import type { RawFuelEntry } from '../types';

const sampleEntriesUnsorted: RawFuelEntry[] = [
	{ id: '2', date: '2023-01-15', odometer: 10500, liters: 35, priceTotalLiter: 70 },
	{ id: '1', date: '2023-01-01', odometer: 10000, liters: 40, priceTotalLiter: 80 },
	{ id: '3', date: '2023-02-01', odometer: 11050, liters: 38, priceTotalLiter: 52 },
];

describe('FuelLog', () => {
	it('should initialize with an empty array', () => {
		const fuelLog = new FuelLog([]);
		expect(fuelLog.getEntries()).toEqual([]);
		expect(fuelLog.getRawEntries()).toEqual([]);
	});

	it('should process a single entry correctly', () => {
		const entry: RawFuelEntry = { id: '1', date: '2023-01-01', odometer: 10000, liters: 40, priceTotalLiter: 80 };
		const fuelLog = new FuelLog([entry]);
		const processed = fuelLog.getEntries();
		expect(processed).toHaveLength(1);
		expect(processed[0].totalCost).toBe(80);
		expect(processed[0].tripDistance).toBeUndefined();
		expect(processed[0].l100km).toBeUndefined();
	});

	it('should sort entries by odometer and process them', () => {
		const fuelLog = new FuelLog(sampleEntriesUnsorted);
		const processed = fuelLog.getEntries();

		expect(processed).toHaveLength(3);
		expect(processed.map((e) => e.odometer)).toEqual([10000, 10500, 11050]); // Sorted

		// Entry 1 (odometer: 10000)
		expect(processed[0].tripDistance).toBeUndefined();
		expect(processed[0].l100km).toBeUndefined();
		expect(processed[0].totalCost).toBeCloseTo(80);

		// Entry 2 (odometer: 10500)
		expect(processed[1].tripDistance).toBe(500); // 10500 - 10000
		expect(processed[1].l100km).toBeCloseTo(7); // (35 / 500) * 100
		expect(processed[1].totalCost).toBeCloseTo(70);

		// Entry 3 (odometer: 11050)
		expect(processed[2].tripDistance).toBe(550); // 11050 - 10500
		expect(processed[2].l100km).toBeCloseTo(6.909); // (38 / 550) * 100
		expect(processed[2].totalCost).toBeCloseTo(52);
	});

	describe('calculateStats', () => {
		it('should return zero stats for no entries', () => {
			const fuelLog = new FuelLog([]);
			const stats = fuelLog.calculateStats();
			expect(stats).toEqual({ averageConsumption: 0, totalCost: 0, totalDistance: 0 });
		});

		it('should return zero distance and consumption for a single entry', () => {
			const entry: RawFuelEntry = { id: '1', date: '2023-01-01', odometer: 10000, liters: 40, priceTotalLiter: 80 };
			const fuelLog = new FuelLog([entry]);
			const stats = fuelLog.calculateStats();
			expect(stats).toEqual({ averageConsumption: 0, totalCost: 80, totalDistance: 0 });
		});

		it('should calculate stats correctly for multiple entries', () => {
			const fuelLog = new FuelLog(sampleEntriesUnsorted);
			const stats = fuelLog.calculateStats();

			const totalDistance = 11050 - 10000; // 1050
			const totalLitersForConsumption = 35 + 38; // 73 (first tank doesn't count for consumption calc)
			const totalCost = 80 + 70 + 52; // 202
			const avgConsumption = (totalLitersForConsumption / totalDistance) * 100; // (73 / 1050) * 100

			expect(stats.totalDistance).toBe(totalDistance);
			expect(stats.totalCost).toBeCloseTo(totalCost);
			expect(stats.averageConsumption).toBeCloseTo(avgConsumption);
		});
	});
});
