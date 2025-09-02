
import React from 'react';
// FIX: The types file was moved to the domain folder.
import type { Stats } from '../domain/types';

interface StatCardProps {
    title: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon }) => (
    <div data-testid="stat-card" className="bg-base-200 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
        <div className="bg-base-300 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <p className="text-2xl font-bold text-text-primary">
                {value} <span className="text-lg font-normal text-text-secondary">{unit}</span>
            </p>
        </div>
    </div>
);


const FireIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.002 8.002 0 0118 10c0 .863-.11 1.703-.32 2.502" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 01-6-6c0-1.657.672-3.157 1.757-4.243A6 6 0 0112 6c1.657 0 3.157.672 4.243 1.757A6 6 0 0112 18z" />
    </svg>
);

const WalletIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const MapIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10v-5.5m0 0l6-3m-6 3l-6-3" />
    </svg>
);


interface StatsDisplayProps {
    stats: Stats;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                title="Consommation moyenne"
                value={stats.averageConsumption.toFixed(2)}
                unit="L/100km"
                icon={<FireIcon className="w-6 h-6 text-brand-secondary" />}
            />
            <StatCard 
                title="Coût total"
                value={stats.totalCost.toFixed(2)}
                unit="€"
                icon={<WalletIcon className="w-6 h-6 text-brand-secondary" />}
            />
            <StatCard 
                title="Distance totale"
                value={stats.totalDistance.toLocaleString('fr-FR')}
                unit="km"
                icon={<MapIcon className="w-6 h-6 text-brand-secondary" />}
            />
        </div>
    );
};