import {
	phoneRegex,
	formatPhoneNumber,
	isValidPhoneNumber,
} from "../utils/phoneUtils";
import { urlRegex, formatUrl, isValidUrl } from "../utils/urlUtils";
import { MessageCircle, Link as LinkIcon } from "lucide-react";

interface TableCellProps {
	content: string | number | null | undefined;
}

export function TableCell({ content }: TableCellProps) {
	const stringContent = String(content ?? "");
	const trimmedContent = stringContent.trim();

	// Check for phone number
	const phoneMatch = trimmedContent.match(phoneRegex);
	if (phoneMatch && isValidPhoneNumber(phoneMatch[0])) {
		const formattedPhone = formatPhoneNumber(phoneMatch[0]);
		const whatsappUrl = `https://wa.me/${formattedPhone.replace(/\D/g, "")}`;

		return (
			<div className="flex items-center space-x-2">
				<span>{stringContent}</span>
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors"
					title="Ouvrir dans WhatsApp">
					<MessageCircle className="w-4 h-4" />
				</a>
			</div>
		);
	}

	// Check for URL
	const urlMatch = trimmedContent.match(urlRegex);
	if (urlMatch && isValidUrl(urlMatch[0])) {
		const formattedUrl = formatUrl(urlMatch[0]);

		return (
			<div className="flex items-center space-x-2">
				<a
					href={formattedUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800 hover:underline">
					{stringContent}
				</a>
				<LinkIcon className="w-4 h-4 text-blue-500" />
			</div>
		);
	}

	// Simple domain detection (e.g., example.com)
	const domainMatch = trimmedContent.match(
		/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
	);
	if (domainMatch && isValidUrl(domainMatch[0])) {
		const formattedUrl = formatUrl(domainMatch[0]);

		return (
			<div className="flex items-center space-x-2">
				<a
					href={formattedUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-800 hover:underline">
					{stringContent}
				</a>
				<LinkIcon className="w-4 h-4 text-blue-500" />
			</div>
		);
	}

	return <span>{stringContent}</span>;
}
