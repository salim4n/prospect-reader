import { X, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { websiteAnalyzer } from "../agents/websiteAnalyzer";
import { templateGenerator } from "../agents/templateGenerator";

interface ModalDataProps {
    selectedRow: string[];
    headers: string[];
    setIsModalOpen: (open: boolean) => void;
}

interface Agent {
    analyze: (data: { [key: string]: string }) => Promise<string>;
    generateTemplate: (analysis: string, type: 'email' | 'phone', data: { [key: string]: string }) => Promise<string>;
}

export default function ModalData({ selectedRow, headers, setIsModalOpen }: ModalDataProps) {
    const [activeTab, setActiveTab] = useState<'data' | 'email' | 'phone'>('data');
    const [analysis, setAnalysis] = useState<string>('');
    const [emailTemplate, setEmailTemplate] = useState<string>('');
    const [phoneTemplate, setPhoneTemplate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const processData = async () => {
        setIsLoading(true);
        try {
            // Convert array data to object for easier processing
            const dataObject = headers.reduce((obj, header, index) => {
                obj[header] = selectedRow[index];
                return obj;
            }, {} as { [key: string]: string });

            // Get website analysis
            const websiteAnalysis = await websiteAnalyzer.analyze(dataObject);
            setAnalysis(websiteAnalysis);

            // Generate templates based on analysis
            const emailContent = await templateGenerator.generateTemplate(websiteAnalysis, 'email', dataObject);
            const phoneScript = await templateGenerator.generateTemplate(websiteAnalysis, 'phone', dataObject);

            setEmailTemplate(emailContent);
            setPhoneTemplate(phoneScript);
        } catch (error) {
            console.error('Error processing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div 
                className="bg-gray-950 rounded-xl p-6 max-w-4xl w-full h-[85vh] shadow-2xl border border-gray-800/50 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-800/50">
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => setActiveTab('data')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'data' ? 'bg-blue-600/90 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        >
                            Données
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('email');
                                if (!analysis) processData();
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeTab === 'email' ? 'bg-blue-600/90 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email Template</span>
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('phone');
                                if (!analysis) processData();
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeTab === 'phone' ? 'bg-blue-600/90 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        >
                            <Phone className="w-4 h-4" />
                            <span>Phone Script</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-1 mt-6">
                    {activeTab === 'data' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            {headers.map((header, index) => {
                                const value = selectedRow[index];
                                const valueStr = String(value || '');
                                const isEmail = typeof value === 'string' && value.includes('@');
                                const isUrl = typeof value === 'string' && value.startsWith('http');
                                const isPhone = typeof value === 'string' && /^\+?\d[\d\s-]+\d$/.test(value);

                                return (
                                    <div key={index} className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-sm font-medium text-blue-400/90">{header}</span>
                                            {isEmail ? (
                                                <a href={`mailto:${valueStr}`} className="text-white hover:text-blue-400/90 break-all">
                                                    {valueStr}
                                                </a>
                                            ) : isUrl ? (
                                                <a href={valueStr} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400/90 break-all">
                                                    {valueStr}
                                                </a>
                                            ) : isPhone ? (
                                                <a href={`tel:${valueStr}`} className="text-white hover:text-blue-400/90">
                                                    {valueStr}
                                                </a>
                                            ) : (
                                                <span className="text-white break-words">{valueStr || '—'}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {activeTab === 'email' && (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500/90"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-800/30 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-white mb-2">Analyse du site web</h3>
                                        <p className="text-gray-300">{analysis || 'Aucune analyse disponible.'}</p>
                                    </div>
                                    <div className="bg-gray-800/30 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-white mb-2">Template Email</h3>
                                        <div className="prose prose-invert max-w-none">
                                            {emailTemplate || 'Le template sera généré après analyse.'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'phone' && (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500/90"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-800/30 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-white mb-2">Analyse du site web</h3>
                                        <p className="text-gray-300">{analysis || 'Aucune analyse disponible.'}</p>
                                    </div>
                                    <div className="bg-gray-800/30 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-white mb-2">Script d'appel</h3>
                                        <div className="prose prose-invert max-w-none">
                                            {phoneTemplate || 'Le script sera généré après analyse.'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}