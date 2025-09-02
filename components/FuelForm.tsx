import React, { useRef, useState } from 'react';
import * as z from 'zod';
import type { RawFuelEntry, FuelEntry } from '../domain/types';
import { CalendarIcon } from './icons/CalendarIcon';
import { GasPumpIcon } from './icons/GasPumpIcon';
import { EuroIcon } from './icons/EuroIcon';
import { RoadIcon } from './icons/RoadIcon';
import { InputField } from './Input';
const schema = z.object({
	date: z.string(),
	liters: z.number().positive('Le litrage est incorrect'),
	price: z.number().positive('Le prix est incorrect'),
	odometer: z.number().min(0, 'Le kilométrage est incorrect'),
});
const initFormDataValue = {
	date: new Date().toISOString().split('T')[0],
	liters: 0,
	price: 0,
	odometer: 0,
};
type FormData = z.infer<typeof schema>;

interface FuelFormProps {
	onAddEntry: (data: Omit<RawFuelEntry, 'id'>) => void;
	entries: FuelEntry[];
}

export const FuelForm: React.FC<FuelFormProps> = ({ onAddEntry, entries }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useState<FormData>(initFormDataValue);
	const [formError, setFormError] = useState<Partial<Record<keyof FormData, string>>>({});
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormError({});
		const result = schema.safeParse(formData);
		if (!result.success) {
			result.error.issues.forEach((err) => {
				setFormError((prev) => ({ ...prev, [err.path[0]]: err.message }));
			});
			return;
		}
		try {
			onAddEntry({
				date: formData.date,
				liters: formData.liters,
				priceTotalLiter: formData.price,
				odometer: formData.odometer,
			});
			setFormData(initFormDataValue);
			formRef.current?.reset();
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Une erreur inattendue est survenue.');
			}
		}
	};

	return (
		<div className='bg-base-200 p-8 rounded-2xl shadow-lg'>
			<h2 className='text-2xl font-bold mb-6 text-text-primary'>Ajouter un plein</h2>
			{error && <p className='bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm'>{error}</p>}
			<form ref={formRef} onSubmit={handleSubmit} className='space-y-6'>
				<InputField
					id='date'
					label='Date du jour'
					type='date'
					value={formData.date}
					onChange={(e) => setFormData((state) => ({ ...state, date: e.target.value }))}
					icon={<CalendarIcon className='w-5 h-5 text-gray-400' />}
					required
				/>
				{formError.date && <p className='bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm'>{formError.date}</p>}
				<InputField
					id='liters'
					label='Litres Total'
					type='number'
					step='0.01'
					placeholder='35'
					// value={formData.liters.toString()}
					onChange={(e) => setFormData((state) => ({ ...state, liters: +e.target.value }))}
					icon={<GasPumpIcon className='w-5 h-5 text-gray-400' />}
					required
				/>
				{formError.liters && <p className='bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm'>{formError.liters}</p>}
				<InputField
					id='price'
					label='Prix Total (€)'
					type='number'
					step='0.001'
					placeholder='60'
					//value={formData.price}
					onChange={(e) => setFormData((state) => ({ ...state, price: +e.target.value }))}
					icon={<EuroIcon className='w-5 h-5 text-gray-400' />}
					required
				/>
				{formError.price && <p className='bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm'>{formError.price}</p>}
				<InputField
					id='odometer'
					label='Kilométrage Total'
					type='number'
					placeholder='66700'
					// value={formData.odometer.toString()}
					onChange={(e) => setFormData((state) => ({ ...state, odometer: +e.target.value }))}
					icon={<RoadIcon className='w-5 h-5 text-gray-400' />}
					required
				/>
				{formError.odometer && <p className='bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm'>{formError.odometer}</p>}
				<button
					type='submit'
					className='w-full text-white bg-brand-primary hover:bg-brand-secondary focus:ring-4 focus:outline-none focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors duration-300'>
					Enregistrer le plein
				</button>
			</form>
		</div>
	);
};
