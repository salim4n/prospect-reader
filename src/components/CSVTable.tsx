import React from "react";
import { ArrowUpDown } from "lucide-react";
import { TableCell } from "./TableCell";

interface CSVTableProps {
	data: string[][];
	headers: string[];
	onSort: (columnIndex: number) => void;
}

export function CSVTable({ data, headers, onSort }: CSVTableProps) {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-800">
			<table className="min-w-full divide-y divide-gray-800">
				<thead className="bg-gray-800">
					<tr>
						{headers.map((header, index) => (
							<th
								key={index}
								className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-600 hover:text-white"
								onClick={() => onSort(index)}>
								<div className="flex items-center space-x-1">
									<span>{header}</span>
									<ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-gray-800">
					{data.map((row, rowIndex) => (
						<tr key={rowIndex} className="hover:bg-gray-600">
							{row.map((cell, cellIndex) => (
								<td
									key={cellIndex}
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
									<TableCell content={cell} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
