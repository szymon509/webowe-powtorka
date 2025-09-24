import { useEffect, useState } from "react";

type Country = {
    cca3: string;
    name: { common: string };
    region: string;
    capital?: string[];
    population: number;
    flags: { png: string };
};

export default function App() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchText, setSearchText] = useState("");
    const [filterRegion, setFilterRegion] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=name,region,capital,population,flags,cca3"
                );
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: Country[] = await res.json();
                setCountries(data);
            } catch (err: any) {
                console.error("Błąd fetch:", err);
                setError(err.message || "Wystąpił błąd");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCountries = countries.filter((c) => {
        const matchesText = c.name.common
            .toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesRegion = filterRegion ? c.region === filterRegion : true;
        return matchesText && matchesRegion;
    });

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Lista krajów</h1>

            {loading && <p>Ładowanie danych...</p>}
            {error && <p style={{ color: "red" }}>Coś poszło nie tak: {error}</p>}
            {!loading && !error && filteredCountries.length === 0 && (
                <p>Brak wyników do wyświetlenia</p>
            )}

            {!loading && !error && (
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Szukaj..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                    >
                        <option value="">Wszystkie</option>
                        <option value="Europe">Europa</option>
                        <option value="Asia">Azja</option>
                        <option value="Africa">Afryka</option>
                        <option value="Americas">Ameryki</option>
                        <option value="Oceania">Oceania</option>
                        <option></option>
                    </select>
                </div>


            )}

            {!loading && !error && !selectedCountry && (
                <ul>
                    {filteredCountries.map((c) => (
                        <li
                            key={c.cca3}
                            onClick={() => setSelectedCountry(c)}
                            style={{ cursor: "pointer", marginBottom: "5px" }}
                        >
                            {c.name.common} – {c.region}
                        </li>
                    ))}
                </ul>
            )}

            {selectedCountry && (
                <div style={{ marginTop: "20px" }}>
                    <h2>{selectedCountry.name.common}</h2>
                    <img
                        src={selectedCountry.flags.png}
                        alt={selectedCountry.name.common}
                        width={150}
                        style={{ border: "1px solid #ccc" }}
                    />
                    <p>Region: {selectedCountry.region}</p>
                    <p>Stolica: {selectedCountry.capital?.[0] || "Brak"}</p>
                    <p>Populacja: {selectedCountry.population.toLocaleString()}</p>

                    <button
                        style={{ marginTop: "10px" }}
                        onClick={() => setSelectedCountry(null)}
                    >
                        Ukryj szczegóły
                    </button>
                </div>
            )}
        </div>
    );
}
}