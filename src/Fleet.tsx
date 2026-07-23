import { useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, GitCompare, Luggage, Users, X } from 'lucide-react';

export type FleetVehicle = {
  id?: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  hourlyPrice: number;
  image: string;
  badge: string;
  passengers: number;
  luggage: number;
  benefit: string;
  amenities: string[];
  cancellation: string;
  serviceMode?: string;
};

type FleetProps = { vehicles: FleetVehicle[]; onRequest: (vehicle: FleetVehicle) => void };
type SortOption = 'Recommended' | 'Price: Low to High' | 'Price: High to Low' | 'Passenger Capacity' | 'Most Popular';
type ServiceFilter = 'All services' | 'Self-drive' | 'Chauffeur service';

function modeOf(vehicle: FleetVehicle) {
  return vehicle.serviceMode || (/^chauffeur service/i.test(vehicle.name) ? 'Chauffeur service' : 'Self-drive');
}
function modelName(vehicle: FleetVehicle) {
  return vehicle.name.replace(/^chauffeur service\s+/i, '').trim();
}

export default function Fleet({ vehicles, onRequest }: FleetProps) {
  const [category, setCategory] = useState('All vehicles');
  const [brand, setBrand] = useState('All brands');
  const [occasion, setOccasion] = useState('Every occasion');
  const [service, setService] = useState<ServiceFilter>('All services');
  const [sort, setSort] = useState<SortOption>('Recommended');
  const [compare, setCompare] = useState<FleetVehicle[]>([]);
  const [details, setDetails] = useState<FleetVehicle | null>(null);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const categories = ['All vehicles', ...Array.from(new Set(vehicles.map(vehicle => vehicle.category)))];
  const brands = ['All brands', ...Array.from(new Set(vehicles.map(vehicle => vehicle.brand)))];
  const occasions = ['Every occasion', 'Business travel', 'Airport transfers', 'Groups', 'VIP arrivals'];

  const visibleVehicles = useMemo(() => {
    const filtered = vehicles.filter(vehicle => {
      const matchesCategory = category === 'All vehicles' || vehicle.category === category;
      const matchesBrand = brand === 'All brands' || vehicle.brand === brand;
      const matchesService = service === 'All services' || modeOf(vehicle) === service;
      const matchesOccasion = occasion === 'Every occasion' ||
        (occasion === 'Business travel' && vehicle.category.toLowerCase().includes('sedan')) ||
        (occasion === 'Airport transfers' && vehicle.category.toLowerCase().includes('suv')) ||
        (occasion === 'Groups' && vehicle.passengers >= 6) ||
        (occasion === 'VIP arrivals' && (vehicle.category.toLowerCase().includes('executive') || vehicle.brand === 'Rolls-Royce'));
      return matchesCategory && matchesBrand && matchesService && matchesOccasion;
    });
    const grouped = Array.from(new Map(filtered.map(vehicle => [modelName(vehicle), vehicle])).values());
    return grouped.sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price;
      if (sort === 'Price: High to Low') return b.price - a.price;
      if (sort === 'Passenger Capacity') return b.passengers - a.passengers;
      if (sort === 'Most Popular') return Number(b.badge.includes('choice') || b.badge.includes('favourite')) - Number(a.badge.includes('choice') || a.badge.includes('favourite'));
      return a.price - b.price;
    });
  }, [vehicles, category, brand, occasion, service, sort]);

  const variantsFor = (vehicle: FleetVehicle) => vehicles.filter(item => modelName(item) === modelName(vehicle));
  const selectedVariant = (vehicle: FleetVehicle) => {
    const variants = variantsFor(vehicle);
    const chosen = variants.find(item => item.name === choices[modelName(vehicle)]);
    if (chosen) return chosen;

    // Regular vehicles must remain self-drive by default. Chauffeur service
    // is only shown when the inventory explicitly marks that variant.
    return variants.find(item => modeOf(item) === 'Self-drive') || variants[0] || vehicle;
  };
  const toggleCompare = (vehicle: FleetVehicle) => setCompare(current => current.some(item => item.name === vehicle.name) ? current.filter(item => item.name !== vehicle.name) : current.length < 3 ? [...current, vehicle] : current);
  const clearFilters = () => { setCategory('All vehicles'); setBrand('All brands'); setOccasion('Every occasion'); setService('All services'); setSort('Recommended'); };

  return <main>
    <section className="border-b border-line bg-white"><div className="mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20"><div className="grid gap-10 lg:grid-cols-[1.1fr_.7fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-sand">The Qatar Rental fleet</p><h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.03] tracking-[-.05em] sm:text-7xl">Find the right vehicle for your <em className="font-normal text-stone-500">journey.</em></h1></div><div><p className="max-w-md text-base leading-7 text-stone-500">Choose from a carefully selected fleet for self-drive journeys. Vehicles marked chauffeur service are available with a professional chauffeur.</p><div className="mt-6 flex flex-wrap gap-3 text-xs text-stone-500"><span className="rounded-full border border-line px-3 py-2">One vehicle card per model</span><span className="rounded-full border border-line px-3 py-2">Approval before payment</span></div></div></div><div className="mt-12 grid gap-5 rounded-2xl bg-mist p-5 sm:grid-cols-3 sm:p-6"><FleetStat value={`${new Set(vehicles.map(modelName)).size}`} label="Vehicle models" /><FleetStat value="24/7" label="Concierge availability" /><FleetStat value={vehicles.length ? `QAR ${Math.min(...vehicles.map(vehicle => vehicle.price)).toLocaleString()}` : 'QAR —'} label="Estimated journeys from" /></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16"><div className="border-b border-line pb-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm text-stone-500">Showing {visibleVehicles.length} models</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Choose by occasion</h2></div><p className="max-w-sm text-sm leading-6 text-stone-500 lg:text-right">Each model is shown once. Select a marked chauffeur service variant when it is available.</p></div><div className="mt-7 flex flex-wrap gap-3"><FilterSelect value={service} onChange={value => setService(value as ServiceFilter)} options={['All services', 'Self-drive', 'Chauffeur service']} /><FilterSelect value={occasion} onChange={setOccasion} options={occasions} /><FilterSelect value={category} onChange={setCategory} options={categories} /><FilterSelect value={brand} onChange={setBrand} options={brands} /><FilterSelect value={sort} onChange={value => setSort(value as SortOption)} options={['Recommended', 'Most Popular', 'Price: Low to High', 'Price: High to Low', 'Passenger Capacity']} /></div></div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{visibleVehicles.map(vehicle => <VehicleCard key={modelName(vehicle)} vehicle={vehicle} variants={variantsFor(vehicle)} selected={selectedVariant(vehicle)} onChoose={selected => setChoices(current => ({ ...current, [modelName(vehicle)]: selected.name }))} compared={compare.some(item => item.name === selectedVariant(vehicle).name)} onCompare={() => toggleCompare(selectedVariant(vehicle))} onDetails={() => setDetails(selectedVariant(vehicle))} onRequest={() => onRequest(selectedVariant(vehicle))} />)}</div>
      {!visibleVehicles.length && <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center"><h2 className="font-display text-2xl font-semibold">No vehicles match those filters</h2><button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold underline">Clear filters</button></div>}
    </section>
    <section className="border-y border-line bg-ink text-white"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 lg:px-8 lg:py-16"><FleetPromise title="Chauffeur included" text="Professional chauffeur service is available only on vehicles explicitly marked chauffeur service." /><FleetPromise title="Reviewed before payment" text="Your chosen vehicle is requested first. Payment follows availability approval." /><FleetPromise title="Concierge guidance" text="Not sure what suits your route? Our team can recommend the right option." /></div></section>
    {compare.length > 0 && <Comparison vehicles={compare} onRemove={toggleCompare} onClose={() => setCompare([])} onRequest={onRequest} />}{details && <VehicleDetails vehicle={details} onClose={() => setDetails(null)} onRequest={onRequest} />}
  </main>;
}

function VehicleCard({ vehicle, variants, selected, onChoose, compared, onCompare, onDetails, onRequest }: { vehicle: FleetVehicle; variants: FleetVehicle[]; selected: FleetVehicle; onChoose: (vehicle: FleetVehicle) => void; compared: boolean; onCompare: () => void; onDetails: () => void; onRequest: () => void }) {
  return <article className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl"><div className="relative h-64 overflow-hidden bg-[#f7f7f4]"><img src={selected.image} alt={`${modelName(selected)} luxury vehicle`} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#876b42] shadow-sm">{selected.badge}</span><button type="button" onClick={onCompare} className={`absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm ${compared ? 'bg-ink text-white' : 'bg-white text-ink'}`}><GitCompare size={14} /> {compared ? 'Added' : 'Compare'}</button></div><div className="p-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-stone-400">{selected.category}</p><h3 className="mt-2 font-display text-2xl font-semibold">{modelName(selected)}</h3>{variants.length > 1 && <div className="mt-4 flex rounded-lg bg-mist p-1">{variants.map(option => <button key={option.name} type="button" onClick={() => onChoose(option)} className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold ${selected.name === option.name ? 'bg-white text-ink shadow-sm' : 'text-stone-500'}`}>{modeOf(option) === 'Chauffeur service' ? 'Chauffeur service' : 'Self-drive'}</button>)}</div>}<p className="mt-3 min-h-12 text-sm leading-6 text-stone-500">{selected.benefit}</p><div className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4 text-sm text-stone-600"><span className="flex items-center gap-2"><Users size={16} className="text-sand" /> Up to {selected.passengers}</span><span className="flex items-center gap-2"><Luggage size={16} className="text-sand" /> {selected.luggage} bags</span><span className="col-span-2 flex items-center gap-2"><Check size={16} className="text-sand" /> {modeOf(selected) === 'Chauffeur service' ? 'Professional chauffeur included' : 'Available for self-drive'}</span></div><div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-xs text-stone-400">Estimated journeys from</p><p className="mt-1 font-display text-xl font-semibold">QAR {selected.price.toLocaleString()}</p><p className="text-xs text-stone-400">QAR {selected.hourlyPrice}/hour</p></div><button type="button" onClick={onDetails} className="text-xs font-semibold underline underline-offset-4">View details</button></div><button type="button" onClick={onRequest} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white">Request booking <ArrowRight size={16} /></button></div></article>;
}

function FleetStat({ value, label }: { value: string; label: string }) { return <div><p className="font-display text-2xl font-semibold">{value}</p><p className="mt-1 text-xs uppercase tracking-[.12em] text-stone-500">{label}</p></div>; }
function FleetPromise({ title, text }: { title: string; text: string }) { return <div><Check className="text-sand" size={21} /><h3 className="mt-4 font-display text-xl font-semibold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-stone-400">{text}</p></div>; }
function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <label className="relative"><select value={value} onChange={event => onChange(event.target.value)} className="min-h-11 appearance-none rounded-lg border border-line bg-white py-2 pl-4 pr-10 text-xs font-semibold text-stone-600 outline-none">{options.map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-stone-400" /></label>; }
function Comparison({ vehicles, onRemove, onClose, onRequest }: { vehicles: FleetVehicle[]; onRemove: (vehicle: FleetVehicle) => void; onClose: () => void; onRequest: (vehicle: FleetVehicle) => void }) { return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,.12)] sm:p-6"><div className="mx-auto max-w-7xl"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-sand">Vehicle comparison</p><h2 className="mt-1 font-display text-xl font-semibold">Compare up to three vehicles</h2></div><button type="button" onClick={onClose} aria-label="Close comparison"><X size={20} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{vehicles.map(vehicle => <div key={vehicle.name} className="rounded-xl border border-line p-4"><div className="flex justify-between gap-3"><div><p className="font-display font-semibold">{modelName(vehicle)}</p><p className="mt-1 text-xs text-stone-500">{modeOf(vehicle)} · {vehicle.category}</p></div><button type="button" onClick={() => onRemove(vehicle)} aria-label={`Remove ${vehicle.name}`}><X size={15} /></button></div><div className="mt-4 space-y-2 text-xs text-stone-600"><p>From <strong>QAR {vehicle.price.toLocaleString()}</strong></p><p>{vehicle.passengers} passengers · {vehicle.luggage} luggage</p><p>QAR {vehicle.hourlyPrice}/hour</p><p>Chauffeur {modeOf(vehicle) === 'Chauffeur service' ? 'included' : 'not included'}</p></div><button type="button" onClick={() => onRequest(vehicle)} className="mt-4 w-full rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white">Request booking</button></div>)}</div></div></div>; }
function VehicleDetails({ vehicle, onClose, onRequest }: { vehicle: FleetVehicle; onClose: () => void; onRequest: (vehicle: FleetVehicle) => void }) { return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl"><div className="relative h-56 bg-[#f7f7f4] sm:h-72"><img src={vehicle.image} alt={modelName(vehicle)} className="h-full w-full object-contain mix-blend-multiply" /><button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm" aria-label="Close details"><X size={18} /></button></div><div className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-sand">{modeOf(vehicle)} · {vehicle.category}</p><h2 className="mt-2 font-display text-3xl font-semibold">{modelName(vehicle)}</h2><div className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4"><FleetStat value={`QAR ${vehicle.price.toLocaleString()}`} label="Estimated from" /><FleetStat value={`${vehicle.passengers}`} label="Passengers" /><FleetStat value={`${vehicle.luggage}`} label="Luggage" /><FleetStat value={`QAR ${vehicle.hourlyPrice}`} label="Per hour" /></div><p className="mt-6 leading-7 text-stone-600">{vehicle.benefit}</p><h3 className="mt-7 font-display text-xl font-semibold">Included with this vehicle</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{vehicle.amenities.map(item => <p key={item} className="flex items-center gap-2 text-sm text-stone-600"><Check size={16} className="text-sand" />{item}</p>)}{modeOf(vehicle) === 'Chauffeur service' && <p className="flex items-center gap-2 text-sm text-stone-600"><Check size={16} className="text-sand" />Professional chauffeur</p>}</div><p className="mt-7 text-xs leading-5 text-stone-500">{vehicle.cancellation}. Prices are estimated and confirmed after your request is reviewed.</p><button type="button" onClick={() => onRequest(vehicle)} className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white">Request this vehicle <ArrowRight size={16} /></button></div></div></div>; }
