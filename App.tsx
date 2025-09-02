import { FuelForm } from './components/FuelForm';
import { FuelHistory } from './components/FuelHistory';
import { StatsDisplay } from './components/StatsDisplay';
import { useFuelData } from './application/useFuelData';
import { GasPumpIcon } from './components/icons/GasPumpIcon';

function App() {
	const { entries, addFuelEntry, deleteFuelEntry, stats, error } = useFuelData();
	return (
		<div className='min-h-screen bg-base-100 text-text-primary p-4 sm:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<header className='mb-8 flex items-center space-x-4'>
					<GasPumpIcon className='w-10 h-10 text-brand-primary' />
					<div>
						<h1 className='text-4xl font-extrabold tracking-tight text-text-primary'>Fuel Tracker Pro</h1>
						<p className='text-text-secondary'>Votre gestionnaire de consommation d'essence</p>
					</div>
				</header>

				<main>
					<StatsDisplay stats={stats} />
					<div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
						<div className='lg:col-span-1 mb-8 lg:mb-0'>
							<FuelForm onAddEntry={addFuelEntry} entries={entries} />
							{error && <p className="text-red-500 flex gap-1 before:content-['⚠️'] before:inline-block">{error}</p>}
						</div>
						<div className='lg:col-span-2'>
							<FuelHistory entries={entries} onDeleteEntry={deleteFuelEntry} />
						</div>
					</div>
				</main>

				<footer className='text-center mt-12 text-sm text-base-300'>
					<p>Développé avec ❤️ pour les amateurs d'automobiles.</p>
				</footer>
			</div>
		</div>
	);
}

export default App;
