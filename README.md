# Fiktivní Burza 📈📈📈

<!--Tento projekt vznikl 27. března 2026 v (zhruba) 9:00 ráno jako součást  transformace studenta SE na UTB.-->
#Asset Management System (AMS)
Moderní finanční dashboard v Reactu pro sledování akciového portfolia v reálném čase

## Funkce
- **Real-time data:** Propojeno s API od Finnhub pro sledování cen akcií
- **Historický trend:** Interaktivní 30denní graf vývoje ceny akcie přes Polygon.io API 
- **Výpočet portfolia:** Výpočet vážené nákupní ceny a celkového zisku/ztráty
- **News Feed:** Agregátor zpráv na základě pořízených akcií
- **Vejcoměr:** Tracker vajec

## Technologie
- **Frontend** React, Vite
- **Design** Tailwind CSS, Lucide React
- **API** Finnhub API, Polygon.io API
- **Grafy** Recharts
- **Deployment** Vercel
<!--- **Filozofie** inspirace Nietzscheho provazochodcem-->

## Co všechno jsem se naučil
Tento projekt mi posloužil jako nauka o Reactu a práci s ním spojenou.
- Práce s asynchronními daty a handling API rate-limitingu (Error 429) - v případě obou API
- Správa stavu portfolia pomocí `useState` a `useEffect`, ukládání do localStorage
- Práce s poli/objekty (`reduce`, `map`, `filter`)
- Responsivní zobrazení dat: Práce s knihovnou Recharts

