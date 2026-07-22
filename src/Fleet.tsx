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
};

type FleetProps = {
  vehicles: FleetVehicle[];
  onRequest: (vehicle: FleetVehicle) => void;
};

type SortOption = 'Recommended' | 'Price: Low to High' | 'Price: High to Low' | 'Passenger Capacity';

export default function Fleet({ vehicles, onRequest }: FleetProps) {
  const [category, setCategory] = useState('All vehicles');
  const [brand, setBrand] = useState('All brands');
  const [sort, setSort] = useState<SortOption>('Recommended');
  const [compare, setCompare] = useState<FleetVehicle[]>([]);
  const [details, setDetails] = useState<FleetVehicle | null>(null);

  const categories = ['All vehicles', ...Array.from(new Set(vehicles.map(vehicle => vehicle.category)))];
  const brands = ['All brands', ...Array.from(new Set(vehicles.map(vehicle => vehicle.brand)))];

  const visibleVehicles = useMemo(() => {
    const filtered = vehicles.filter(vehicle =>
      (category === 'All vehicles' || vehicle.category === category) &&
      (brand === 'All brands' || vehicle.brand === brand)
    );

    return [...filtered].sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price;
      if (sort === 'Price: High to Low') return b.price - a.price;
      if (sort === 'Passenger Capacity') return b.passengers - a.passengers;
      return 0;
    });
  }, [vehicles, category, brand, sort]);

  const toggleCompare = (vehicle: FleetVehicle) => {
    setCompare(current => current.some(item => item.name === vehicle.name)
      ? current.filter(item => item.name !== vehicle.name)
      : current.length < 3 ? [...current, vehicle] : current);
  };

  return (
    <main>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-sand">The Qatar Rental fleet</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-[-.05em] sm:text-7xl">
                Choose your <em className="font-normal text-stone-500">perfect journey.</em>
              </h1>
            </div>
            <p className="max-w-md text-base leading-7 text-stone-500 lg:justify-self-end">
              A considered collection of premium vehicles, each arranged with a professional chauffeur and tailored to the way you travel across Qatar.
            </p>
          </div>
          <div className="mt-10 grid gap-4 rounded-2xl bg-mist p-4 sm:grid-cols-3 sm:p-5">
            <FleetStat value={`${vehicles.length}`} label="Premium vehicles" />
            <FleetStat value="24/7" label="Concierge availability" />
            <FleetStat value="QAR 420" label="Estimated journeys from" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-stone-500">Showing {visibleVehicles.length} vehicles</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">Find the right fit for your occasion</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterSelect value={category} onChange={setCategory} options={categories} />
            <FilterSelect value={brand} onChange={setBrand} options={brands} />
            <FilterSelect value={sort} onChange={value => setSort(value as SortOption)} options={['Recommended', 'Price: Low to High', 'Price: High to Low', 'Passenger Capacity']} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleVehicles.map(vehicle => {
            const isCompared = compare.some(item => item.name === vehicle.name);
            return (
              <article key={vehicle.name} className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl">
                <div className="relative h- sixty h-64 overflow-hidden bg-[#f7f7f4]">
                  <img src={vehicle.image} alt={`${vehicle.name} luxury chauffeur vehicle`} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#876b42] shadow-sm">{vehicle.badge}</span>
                  <button type="button" onClick={() => toggleCompare(vehicle)} className={`absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm ${isCompared ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
                    <GitCompare size={14} /> {isCompared ? 'Added' : 'Compare'}
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-stone-400">{vehicle.category}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{vehicle.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-stone-500">{vehicle.benefit}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4 text-sm text-stone-600">
                    <span className="flex items-center gap-2"><Users size={16} className="text-sand" /> Up to {vehicle.passengers}</span>
                    <span className="flex items-center gap-2"><Luggage size={16} className="text-sand" /> {vehicle.luggage} bags</span>
                    <span className="col-span-2 flex items-center gap-2"><Check size={16} className="text-sand" /> Professional chauffeur included</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-stone-400">Estimated journeys from</p>
                      <p className="mt-1 font-display text-xl font-semibold">QAR {vehicle.price.toLocaleString()}</p>
                      <p className="text-xs text-stone-400">QAR {vehicle.hourlyPrice}/hour</p>
                    </div>
                    <button type="button" onClick={() => setDetails(vehicle)} className="text-xs font-semibold underline underline-offset-4">View details</button>
                  </div>
                  <button type="button" onClick={() => onRequest(vehicle)} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white">Request booking <ArrowRight size={16} /></button>
                </div>
              </article>
            );
          })}
        </div>

        {!visibleVehicles.length && <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center"><h2 className="font-display text-2xl font-semibold">No vehicles match those filters</h2><button type="button" onClick={() => { setCategory('All vehicles'); setBrand('All brands'); }} className="mt-4 text-sm font-semibold underline">Clear filters</button></div>}
      </section>

      <section className="border-y border-line bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 lg:px-8 lg:py-16">
          <FleetPromise title="Chauffeur included" text="Every vehicle is delivered with a professional, discreet chauffeur." />
          <FleetPromise title="Reviewed before payment" text="Your chosen vehicle is requested first. Payment follows availability approval." />
          <FleetPromise title="Concierge guidance" text="Not sure what suits your route? Our team can recommend the right vehicle." />
        </div>
      </section>

      {compare.length > 0 && <Comparison vehicles={compare} onRemove={vehicle => toggleCompare(vehicle)} onClose={() => setCompare([])} onRequest={onRequest} />}
      {details && <VehicleDetails vehicle={details} onClose={() => setDetails(null)} onRequest={onRequest} />}
    </main>
  );
}

function FleetStat({ value, label }: { value: string; label: string }) { return <div><p className="font-display text-2xl font-semibold">{value}</p><p className="mt-1 text-xs uppercase tracking-[.12em] text-stone-500">{label}</p></div>; }
function FleetPromise({ title, text }: { title: string; text: string }) { return <div><Check className="text-sand" size={21} /><h3 className="mt-4 font-display text-xl font-semibold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-stone-400">{text}</p></div>; }
function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <label className="relative"><select value={value} onChange={event => onChange(event.target.value)} className="min-h-11 appearance-none rounded-lg border border-line bg-white py-2 pl-4 pr-10 text-xs font-semibold text-stone-600 outline-none"><option disabled={false}>{value}</option>{options.filter(option => option !== value).map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-stone-400" /></label>; }

function Comparison({ vehicles, onRemove, onClose, onRequest }: { vehicles: FleetVehicle[]; onRemove: (vehicle: FleetVehicle) => void; onClose: () => void; onRequest: (vehicle: FleetVehicle) => void }) {
  return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,.12)] sm:p-6"><div className="mx-auto max-w-7xl"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-sand">Vehicle comparison</p><h2 className="mt-1 font-display text-xl font-semibold">Compare up to three vehicles</h2></div><button type="button" onClick={onClose} aria-label="Close comparison"><X size={20} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{vehicles.map(vehicle => <div key={vehicle.name} className="rounded-xl border border-line p-4"><div className="flex justify-between gap-3"><div><p className="font-display font-semibold">{vehicle.name}</p><p className="mt-1 text-xs text-stone-500">{vehicle.category}</p></div><button type="button" onClick={() => onRemove(vehicle)} aria-label={`Remove ${vehicle.name}`}><X size={15} /></button></div><div className="mt-4 space-y-2 text-xs text-stone-600"><p>From <strong>QAR {vehicle.price.toLocaleString()}</strong></p><p>{vehicle.passengers} passengers · {vehicle.luggage} luggage</p><p>QAR {vehicle.hourlyPrice}/hour</p></div><button type="button" onClick={() => onRequest(vehicle)} className="mt-4 w-full rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white">Request booking</button></div>)}</div></div></div>;
}

function VehicleDetails({ vehicle, onClose, onRequest }: { vehicle: FleetVehicle; onClose: () => void; onRequest: (vehicle: FleetVehicle) => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl"><div className="relative h-56 bg-[#f7f7f4] sm:h-72"><img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-contain mix-blend-multiply" /><button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm" aria-label="Close details"><X size={18} /></button></div><div className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-sand">{vehicle.category}</p><h2 className="mt-2 font-display text-3xl font-semibold">{vehicle.name}</h2><div className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4"><FleetStat value={`QAR ${vehicle.price.toLocaleString()}`} label="Estimated from" /><FleetStat value={`${vehicle.passengers}`} label="Passengers" /><FleetStat value={`${vehicle.luggage}`} label="Luggage" /><FleetStat value={`QAR ${vehicle.hourlyPrice}`} label="Per hour" /></div><p className="mt-6 leading-7 text-stone-600">{vehicle.benefit}</p><h3 className="mt-7 font-display text-xl font-semibold">Included with this vehicle</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{vehicle.amenities.map(item => <p key={item} className="flex items-center gap-2 text-sm text-stone-600"><Check size={16} className="text-sand" />{item}</p>)}<p className="flex items-center gap-2 text-sm text-stone-600"><Check size={16} className="text-sand" />Professional chauffeur</p></div><p className="mt-7 text-xs leading-5 text-stone-500">{vehicle.cancellation}. Prices are estimated and confirmed after your request is reviewed.</p><button type="button" onClick={() => onRequest(vehicle)} className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white">Request this vehicle <ArrowRight size={16} /></button></div></div></div>;
}
