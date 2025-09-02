import { describe, beforeEach, it, expect, vi } from 'vitest';
import { InDatabaseFuelRepository } from '../FuelRepository';
import type { RawFuelEntry } from '../../domain/types';

describe('InDatabaseFuelRepository', () => {
	let repo: InDatabaseFuelRepository;
	let originalFetch: typeof fetch;

	beforeEach(() => {
		repo = new InDatabaseFuelRepository();
		// Sauvegarde la fonction fetch originale
		originalFetch = global.fetch;
	});

	afterEach(() => {
		// Restaure la fonction fetch originale pour éviter les interférences
		global.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	it('should load data from API', async () => {
		// Mock de la réponse fetch
		const mockFuelEntries: RawFuelEntry[] = [{ id: '1', date: '2023-01-01', liters: 40, priceTotalLiter: 80, odometer: 1000 }];
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockFuelEntries),
		});
		const data = await repo.load();
		expect(fetch).toHaveBeenCalledOnce();
		expect(data).toEqual(mockFuelEntries);
	});

	it('should throw error on add failure', async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
			} as Response)
		);
		const newItem: Omit<RawFuelEntry, 'id'> = { date: '2023-01-01', liters: 40, priceTotalLiter: 80, odometer: 1000 };
		await expect(repo.add(newItem)).rejects.toThrow('Failed to add fuel entry');
		expect(fetch).toHaveBeenCalledOnce();
	});
});
