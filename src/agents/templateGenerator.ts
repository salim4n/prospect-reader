interface UserContext {
    companyName: string;
    industry: string;
    role: string;
    products: string[];
    valueProposition: string;
    communicationStyle: string;
}

// This would typically come from a configuration file or environment variables
const USER_CONTEXT: UserContext = {
    companyName: "IgnitionAI",
    industry: "Technology/AI",
    role: "Sales Development Representative",
    products: [
        "AI-powered prospect analysis",
        "Automated lead generation",
        "Intelligent communication templates"
    ],
    valueProposition: "Help businesses optimize their sales process with AI-driven insights and automation",
    communicationStyle: "Professional, consultative, and solution-focused"
};

class TemplateGenerator {
    private userContext: UserContext;

    constructor(userContext: UserContext) {
        this.userContext = userContext;
    }

    private generateEmailTemplate(analysis: string, prospectData: { [key: string]: string }): string {
        const prospectName = prospectData['Contact Name'] || prospectData['Nom'] || 'valued prospect';
        const companyName = prospectData['Company Name'] || prospectData['Société'] || 'your company';

        return `
Subject: Enhancing ${companyName}'s Operations with AI-Driven Solutions

Dear ${prospectName},

I hope this email finds you well. I came across ${companyName}'s impressive work in ${prospectData['Industry'] || 'your industry'} and was particularly intrigued by your approach to [specific point from analysis].

At ${this.userContext.companyName}, we specialize in ${this.userContext.valueProposition}, and I believe we could bring significant value to ${companyName} by:

1. [Benefit aligned with prospect's needs]
2. [Benefit aligned with prospect's industry]
3. [Benefit aligned with prospect's potential pain points]

Would you be open to a brief conversation to explore how we might help ${companyName} achieve [specific goal]?

Best regards,
[Your name]
${this.userContext.role}
${this.userContext.companyName}
        `;
    }

    private generatePhoneScript(analysis: string, prospectData: { [key: string]: string }): string {
        const prospectName = prospectData['Contact Name'] || prospectData['Nom'] || 'prospect';
        const companyName = prospectData['Company Name'] || prospectData['Société'] || 'the company';

        return `
Call Script for ${prospectName} at ${companyName}

Introduction:
"Hi, this is [Your Name] from ${this.userContext.companyName}. Am I speaking with ${prospectName}?"

Purpose Statement:
"I'm reaching out because we've been helping companies in ${prospectData['Industry'] || 'your industry'} to [specific value proposition based on analysis]. Based on what I've learned about ${companyName}, I thought you might be interested in hearing about how we could help with [specific challenge or opportunity]."

Key Talking Points:
1. Acknowledge their current approach: [Point from analysis]
2. Present relevant case study
3. Discuss specific value proposition for their situation

Questions to Ask:
1. "What's your current approach to [relevant challenge]?"
2. "What would be the impact if you could [solve specific problem]?"
3. "How are you currently handling [specific process]?"

Next Steps:
- If interested: Schedule a detailed discovery call
- If not ready: Ask about timing and stay in touch
- If not interested: Thank them and ask if you can share some resources

Closing:
"Thank you for your time, [Name]. [Appropriate next step based on conversation]"
        `;
    }

    public async generateTemplate(
        analysis: string,
        type: 'email' | 'phone',
        prospectData: { [key: string]: string }
    ): Promise<string> {
        // Here we would typically use an LLM to generate the template
        // For now, we'll use our predefined templates
        return type === 'email' 
            ? this.generateEmailTemplate(analysis, prospectData)
            : this.generatePhoneScript(analysis, prospectData);
    }
}

export const templateGenerator = new TemplateGenerator(USER_CONTEXT);
