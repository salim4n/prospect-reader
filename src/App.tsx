import { useState, useCallback } from "react";
import { FileUpload } from "./components/FileUpload";
import { SearchBar } from "./components/SearchBar";
import { CSVTable } from "./components/CSVTable";
import { parseFile } from "./utils/fileParser";
import logo from "./assets/images/ignition_flame.gif"; // Importez votre logo

function App() {
	const [headers, setHeaders] = useState<string[]>([]);
	const [data, setData] = useState<string[][]>([]);
	const [filteredData, setFilteredData] = useState<string[][]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sortConfig, setSortConfig] = useState<{
		column: number;
		direction: "asc" | "desc" | null;
	}>({
		column: -1,
		direction: null,
	});

	const handleFileUpload = useCallback(async (file: File) => {
		setLoading(true);
		setError(null);

		try {
			const { headers: parsedHeaders, data: parsedData } = await parseFile(
				file,
			);
			setHeaders(parsedHeaders);
			setData(parsedData);
			setFilteredData(parsedData);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Erreur lors de la lecture du fichier",
			);
			console.error("Error parsing file:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearch = useCallback(
		(query: string) => {
			if (!query) {
				setFilteredData(data);
				return;
			}

			const searchLower = query.toLowerCase();
			const filtered = data.filter((row) =>
				row.some((cell) =>
					cell?.toString().toLowerCase().includes(searchLower),
				),
			);
			setFilteredData(filtered);
		},
		[data],
	);

	const handleSort = useCallback(
		(columnIndex: number) => {
			setSortConfig((prevConfig) => {
				const newDirection =
					prevConfig.column === columnIndex
						? prevConfig.direction === "asc"
							? "desc"
							: prevConfig.direction === "desc"
							? null
							: "asc"
						: "asc";

				const sortedData = [...filteredData].sort((a, b) => {
					if (newDirection === null) return 0;
					const compareA = (a[columnIndex] || "").toString().toLowerCase();
					const compareB = (b[columnIndex] || "").toString().toLowerCase();
					const comparison = compareA.localeCompare(compareB);
					return newDirection === "asc" ? comparison : -comparison;
				});

				setFilteredData(newDirection === null ? data : sortedData);

				return {
					column: columnIndex,
					direction: newDirection,
				};
			});
		},
		[filteredData, data],
	);

	return (
		<div className="min-h-screen bg-gray-600 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<div className="flex justify-center">
						{" "}
						{/* Ajout de cette ligne pour centrer le logo */}
						<img src={logo} alt="Mon Logo" className="h-16 w-16" />
					</div>
					<h1 className="mt-2 text-3xl font-bold text-gray-50">
						Visualiseur de données
					</h1>
					<p className="mt-2 text-gray-600">
						Importez votre fichier CSV ou Excel pour visualiser et analyser vos
						données
					</p>
				</div>

				{loading && (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
						<p className="mt-4 text-gray-50">Chargement du fichier...</p>
					</div>
				)}

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{!loading && !headers.length && (
					<FileUpload onFileUpload={handleFileUpload} />
				)}

				{!loading && headers.length > 0 && (
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<SearchBar onSearch={handleSearch} />
							<button
								onClick={() => {
									setHeaders([]);
									setData([]);
									setFilteredData([]);
									setError(null);
								}}
								className="px-4 py-2 text-sm font-medium text-gray-50 bg-blue-950 border border-gray-600 rounded-md hover:bg-gray-600">
								Charger un autre fichier
							</button>
						</div>

						<div className="bg-gray-800 shadow rounded-lg">
							<CSVTable
								headers={headers}
								data={filteredData}
								onSort={handleSort}
							/>
						</div>

						<div className="text-sm text-gray-50 text-right">
							{filteredData.length} lignes affichées sur {data.length} au total
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
