import { useState, useMemo, useCallback, useEffect } from 'react';
import type { RawFuelEntry } from '../domain/types';
import { FuelLog } from '../domain/FuelLog';
import { InDatabaseFuelRepository, LocalStorageFuelRepository, IFuelRepository } from '../infrastructure/FuelRepository';

// Now we use InDatabaseFuelRepository
const repository: IFuelRepository = new InDatabaseFuelRepository();
//const repository: IFuelRepository = new LocalStorageFuelRepository();

export const useFuelData = () => {
	const [fuelLog, setFuelLog] = useState<FuelLog>(new FuelLog([]));
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			const initialEntries = await repository.load();
			setFuelLog(new FuelLog(initialEntries));
		};
		loadData();
	}, []);

	const entries = useMemo(() => fuelLog.getEntries(), [fuelLog]);
	const stats = useMemo(() => fuelLog.calculateStats(), [fuelLog]);

	const addFuelEntry = useCallback(
		async (data: Omit<RawFuelEntry, 'id'>) => {
			if (fuelLog.getEntries().some((entry) => data.odometer > 0 && entry.odometer === data.odometer)) {
				const message = `Un relevé avec ce kilométrage (${data.odometer} km) existe déjà.`;
				setError(message);
				console.error(message);
				//throw new Error(message);
			} else {
				const newEntry = await repository.add(data);
				const updatedRawEntries = [...fuelLog.getRawEntries(), newEntry];
				setError('');
				setFuelLog(new FuelLog(updatedRawEntries));
			}
		},
		[fuelLog]
	);

	const deleteFuelEntry = useCallback(
		async (id: string) => {
			await repository.delete(id);
			const updatedRawEntries = fuelLog.getRawEntries().filter((entry) => entry.id !== id);
			setFuelLog(new FuelLog(updatedRawEntries));
		},
		[fuelLog]
	);

	return { entries, addFuelEntry, deleteFuelEntry, stats, error };
};
