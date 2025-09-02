import type { RawFuelEntry, FuelEntry, Stats } from './types';

export class FuelLog {
	private readonly rawEntries: RawFuelEntry[];
	private readonly processedEntries: FuelEntry[];

	constructor(rawEntries: RawFuelEntry[]) {
		this.rawEntries = [...rawEntries];
		this.processedEntries = this.processEntries();
	}

	private processEntries(): FuelEntry[] {
		const sortedEntries = [...this.rawEntries].sort((a, b) => a.odometer - b.odometer);

		return sortedEntries.map((entry, index) => {
			const processedEntry: FuelEntry = {
				...entry,
				totalCost: entry.priceTotalLiter,
			};

			if (index > 0) {
				const prevEntry = sortedEntries[index - 1];
				const tripDistance = entry.odometer - prevEntry.odometer;
				processedEntry.tripDistance = tripDistance;
				if (tripDistance > 0) {
					processedEntry.l100km = (entry.liters / tripDistance) * 100;
				}
			}
			return processedEntry;
		});
	}

	getEntries(): FuelEntry[] {
		return this.processedEntries;
	}

	getRawEntries(): RawFuelEntry[] {
		return this.rawEntries;
	}

	calculateStats(): Stats {
		const entries = this.processedEntries.filter((item) => item.odometer > 0);
		if (entries.length < 2) {
			const totalCost = entries.reduce((acc, entry) => acc + entry.totalCost, 0);
			return { averageConsumption: 0, totalCost, totalDistance: 0 };
		}
		const firstEntry = entries[0];
		const lastEntry = entries[entries.length - 1];
		const totalLiters = entries.reduce((sum, entry) => sum + entry.liters, 0);
		const totalDistance = lastEntry.odometer - firstEntry.odometer;
		const totalCost = entries.reduce((sum, entry) => sum + entry.totalCost, 0);
		const averageConsumption = totalDistance > 0 ? (totalLiters / totalDistance) * 100 : 0;
		return {
			averageConsumption,
			totalCost,
			totalDistance,
		};
	}
}
