import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
	return (
		<div className="relative">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search className="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-600 placeholder-gray-50 focus:outline-none focus:placeholder-gray-50 focus:ring-1 focus:ring-blue-950 focus:border-blue-950 sm:text-sm"
				placeholder="Rechercher dans les données..."
				onChange={(e) => onSearch(e.target.value)}
			/>
		</div>
	);
}
