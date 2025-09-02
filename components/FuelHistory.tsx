
import React from 'react';
// FIX: The types file was moved to the domain folder.
import type { FuelEntry } from '../domain/types';
import { CalendarIcon } from './icons/CalendarIcon';
import { GasPumpIcon } from './icons/GasPumpIcon';
import { EuroIcon } from './icons/EuroIcon';
import { RoadIcon } from './icons/RoadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FuelHistoryProps {
    entries: FuelEntry[];
    onDeleteEntry: (id: string) => void;
}

const HistoryItem: React.FC<{ entry: FuelEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => (
    <li className="bg-base-200 p-5 rounded-xl shadow-lg transition-transform hover:scale-[1.02] relative group">
        <div className="sm:flex justify-between items-start mb-4 space-y-3">
            <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-text-secondary" />
                <span className="font-bold text-lg text-text-primary">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
            {entry.l100km && (
                <div className="bg-brand-primary/20 text-brand-secondary text-sm font-bold px-3 py-1 rounded-full text-center">
                    {entry.l100km.toFixed(2)} <span>L/100km</span>
                </div>
            )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
                <GasPumpIcon className="w-4 h-4 text-text-secondary"/>
                <p><span className="font-semibold">{entry.liters.toFixed(2)}</span> L</p>
            </div>
            <div className="flex items-center space-x-2">
                <EuroIcon className="w-4 h-4 text-text-secondary"/>
                <p><span className="font-semibold">{entry.priceTotalLiter.toFixed(3)}</span> €/L</p>
            </div>
             <div className="flex items-center space-x-2">
                <RoadIcon className="w-4 h-4 text-text-secondary"/>
                <p><span className="font-semibold">{entry.odometer.toLocaleString('fr-FR')}</span> km</p>
            </div>
            <div className="flex items-center space-x-2 font-bold text-lg text-text-primary">
                 <p>{entry.totalCost.toFixed(2)} €</p>
            </div>
        </div>

        {entry.tripDistance && (
            <div className="mt-3 pt-3 border-t border-base-300 text-xs text-text-secondary">
                Distance depuis le dernier plein: <span className="font-semibold text-text-primary">{entry.tripDistance.toLocaleString('fr-FR')} km</span>
            </div>
        )}

        <button
            onClick={() => onDelete(entry.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-base-300 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-900/50 hover:text-red-300 transition-all duration-300"
            aria-label="Supprimer l'entrée"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
    </li>
);


export const FuelHistory: React.FC<FuelHistoryProps> = ({ entries, onDeleteEntry }) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.odometer - a.odometer);

    return (
        <div className="bg-base-200 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-text-primary">Historique des pleins</h2>
            {sortedEntries.length > 0 ? (
                <ul aria-label="history-list" className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {sortedEntries.map(entry => (
                        <HistoryItem key={entry.id} entry={entry} onDelete={onDeleteEntry} />
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10 px-6 bg-base-300 rounded-lg">
                    <GasPumpIcon className="w-12 h-12 mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary">Aucun plein enregistré</h3>
                    <p className="text-text-secondary mt-1">Ajoutez votre premier plein pour commencer le suivi!</p>
                </div>
            )}
        </div>
    );
};