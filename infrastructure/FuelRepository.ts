import type { RawFuelEntry } from '../domain/types';
import { API_DEFAULT_URL } from '../lib/constant';

const STORAGE_KEY = 'fuelData';

export interface IFuelRepository {
	load(): Promise<RawFuelEntry[]>;
	add(entry: Omit<RawFuelEntry, 'id'>): Promise<RawFuelEntry>;
	delete(id: string): Promise<void>;
}

export class LocalStorageFuelRepository implements IFuelRepository {
	load(): Promise<RawFuelEntry[]> {
		try {
			const savedData = localStorage.getItem(STORAGE_KEY);
			const entries = savedData ? JSON.parse(savedData) : [];
			return Promise.resolve(entries);
		} catch (error) {
			console.error('Error reading from localStorage', error);
			return Promise.resolve([]);
		}
	}

	async add(entry: Omit<RawFuelEntry, 'id'>): Promise<RawFuelEntry> {
		const entries = await this.load();
		const newEntry = { ...entry, id: new Date().toISOString() };
		const updatedEntries = [...entries, newEntry];
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
			return Promise.resolve(newEntry);
		} catch (error) {
			console.error('Error writing to localStorage', error);
			return Promise.reject(error);
		}
	}

	async delete(id: string): Promise<void> {
		const entries = await this.load();
		const updatedEntries = entries.filter((entry) => entry.id !== id);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
			return Promise.resolve();
		} catch (error) {
			console.error('Error writing to localStorage', error);
			return Promise.reject(error);
		}
	}
}

export class InDatabaseFuelRepository implements IFuelRepository {
	private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_DEFAULT_URL;

	async load(): Promise<RawFuelEntry[]> {
		const response = await fetch(`${this.API_BASE_URL}/fuel-logs`);
		if (!response.ok) {
			return [];
		}
		const data = await response.json();
		return data;
	}

	async add(entry: Omit<RawFuelEntry, 'id'>): Promise<RawFuelEntry> {
		const response = await fetch(`${this.API_BASE_URL}/fuel-logs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(entry),
		});
		if (!response.ok) {
			throw new Error('Failed to add fuel entry');
		}
		return response.json();
	}

	async delete(id: string): Promise<void> {
		const response = await fetch(`${this.API_BASE_URL}/fuel-logs/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error('Failed to delete fuel entry');
		}
	}
}