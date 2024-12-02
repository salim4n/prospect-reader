import axios from 'axios';
import * as cheerio from 'cheerio';

class WebsiteAnalyzer {
    private async fetchWebsiteContent(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching website:', error);
            return '';
        }
    }

    private extractTextContent(html: string): string {
        const $ = cheerio.load(html);
        
        // Remove script tags, style tags, and comments
        $('script').remove();
        $('style').remove();
        $('comments').remove();
        
        // Get text from specific important elements
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const h1Text = $('h1').map((_: any, el: any) => $(el).text()).get().join(' ');
        const mainContent = $('main, article, .main-content').text() || $('body').text();
        
        return `${title}\n${description}\n${h1Text}\n${mainContent}`;
    }

    private analyzeContent(text: string, companyData: { [key: string]: string }): string {
        // Here we would typically use an LLM to analyze the content
        // For now, we'll return a structured analysis
        const companyName = companyData['Company Name'] || companyData['Nom'] || '';
        const industry = companyData['Industry'] || companyData['Industrie'] || '';
        
        return `
Company Analysis for ${companyName}
Industry: ${industry}

Website Content Analysis:
${text.slice(0, 500)}...

Key Points:
- Website content extracted and analyzed
- Industry context considered
- Company information integrated

This analysis can be used to generate personalized communication templates.
        `;
    }

    private findValidUrl(data: { [key: string]: string }): string | undefined {
        // First try to find URL in website-related fields
        const websiteUrl = Object.entries(data).find(([key, value]) => 
            typeof value === 'string' &&
            value.toLowerCase().startsWith('http') &&
            !value.toLowerCase().includes('bing') &&
            (key.toLowerCase().includes('website') || 
             key.toLowerCase().includes('site') || 
             key.toLowerCase().includes('url'))
        )?.[1];

        if (websiteUrl) return websiteUrl;

        // If no website field found, look for any valid URL in other fields
        const anyUrl = Object.values(data).find(value => 
            typeof value === 'string' &&
            value.toLowerCase().startsWith('http') &&
            !value.toLowerCase().includes('bing')
        );

        return anyUrl;
    }

    public async analyze(data: { [key: string]: string }): Promise<string> {
        const websiteUrl = this.findValidUrl(data);

        if (!websiteUrl) {
            return 'No valid website URL found in the provided data.';
        }

        const html = await this.fetchWebsiteContent(websiteUrl);
        if (!html) {
            return 'Unable to fetch website content.';
        }

        const textContent = this.extractTextContent(html);
        return this.analyzeContent(textContent, data);
    }
}

export const websiteAnalyzer = new WebsiteAnalyzer();
