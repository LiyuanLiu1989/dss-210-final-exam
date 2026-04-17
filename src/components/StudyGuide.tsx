import { useState } from "react";
import { 
  Book, 
  Target, 
  BarChart3, 
  Sigma, 
  Calculator, 
  CheckCircle2, 
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { Button } from "./ui/button";

interface DetailContent {
  title: string;
  math: string;
  example: string;
  proTip: string;
}

interface StudyItem {
  id: string;
  name: string;
  def: string;
  tag: string;
  image: string;
  details: DetailContent;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&h=300&auto=format&fit=crop";

export default function StudyGuide() {
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);

  const sections = [
    {
      title: "Sampling Methods",
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      items: [
        {
          id: "srs",
          name: "Simple Random Sampling",
          def: "Every individual in the population has an exactly equal chance of being selected (like a lottery).",
          tag: "The Pure Random",
          image: DEFAULT_IMAGE,
          details: {
            title: "SRS Mechanics",
            math: "Probability of selection: $P = n / N$.\nRequires a complete list (sampling frame) of the population.",
            example: "**Business Application:** An internal auditor generates random numbers to select 50 out of 5,000 invoices to check for payment accuracy and compliance.",
            proTip: "The gold standard for reducing bias, but often logistically difficult for massive populations."
          }
        },
        {
          id: "stratified",
          name: "Stratified Sampling",
          def: "Divide the population into groups (strata) by characteristics, then sample from each group.",
          tag: "The Balanced Set",
          image: DEFAULT_IMAGE,
          details: {
            title: "Stratified Logic",
            math: "$n_i = (N_i / N) \\times n_{total}$\nEnsures proportional representation of sub-groups.",
            example: "**Business Application:** A smartphone maker surveys customer satisfaction by 'Income Tier' to ensure premium users' feedback isn't drowned out by the larger budget-tier group.",
            proTip: "Reduces sampling error by ensuring no critical minority group is left out."
          }
        },
        {
          id: "cluster",
          name: "Cluster Sampling",
          def: "Divide population into groups (clusters), randomly pick clusters, and survey everyone in them.",
          tag: "The Group Raid",
          image: DEFAULT_IMAGE,
          details: {
            title: "Cluster Mechanics",
            math: "Step 1: Divide pop into $N$ clusters.\nStep 2: SRS to pick $n$ clusters.\nStep 3: Census (survey all) in picked clusters.",
            example: "**Business Application:** A retail chain tests a new store layout by randomly selecting 5 specific cities and implementing the change in every store within those 5 cities.",
            proTip: "Highly cost-effective for geographically dispersed populations, but adds 'cluster bias'."
          }
        },
        {
          id: "systematic",
          name: "Systematic Sampling",
          def: "Selecting members at a regular interval (every kth person) from a ordered list.",
          tag: "The Pattern",
          image: DEFAULT_IMAGE,
          details: {
            title: "Calculating Interval k",
            math: "$k = N / n$.\nStart at a random point between 1 and $k$, then pick every $k$th person.",
            example: "**Business Application:** A data center quality check involves inspecting the throughput of every 100th server rack as it comes off the assembly line.",
            proTip: "Very easy to execute on assembly lines, but dangerous if the population has a hidden cycle that matches $k$."
          }
        },
        {
          id: "convenience",
          name: "Convenience Sampling",
          def: "Selecting individuals who are easiest to reach or most available.",
          tag: "The Path of Ease",
          image: DEFAULT_IMAGE,
          details: {
            title: "Non-Probability Setup",
            math: "No complex probability math — just selection based on accessibility.",
            example: "**Business Application:** A software startup asks its office floor neighbors for feedback on their new UI design because it's faster than hiring a research firm.",
            proTip: "Fast and cheap for initial testing, but results cannot be generalized to the broader population."
          }
        }
      ]
    },
    {
      title: "Normal Distribution",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50",
      items: [
        {
          id: "excel-cheatsheet",
          name: "Excel Syntax CheatSheet",
          def: "The essential formulas for calculating probabilities using the Normal Distribution in Excel.",
          tag: "Exam Secret",
          image: DEFAULT_IMAGE,
          details: {
            title: "Normal Dist Excel Table",
            math: "| Question Description | Excel Syntax |\n| :--- | :--- |\n| Individual ($x$) & Less Than | `=NORM.DIST(x, mean, sd, TRUE)` |\n| Individual ($x$) & More Than | `=1-NORM.DIST(x, mean, sd, TRUE)` |\n| Individual & Between $x1, x2$ | `=NORM.DIST(x2, ...)-NORM.DIST(x1, ...)` |\n| Sample (avg) & Less Than | `=NORM.DIST(x, mean, sd/SQRT(n), TRUE)` |\n| Sample (avg) & More Than | `=1-NORM.DIST(x, mean, sd/SQRT(n), TRUE)` |\n| Sample & Between $x1, x2$ | `=NORM.DIST(x2, mean, sd/SQRT(n), TRUE)-NORM.DIST(x1, mean, sd/SQRT(n), TRUE)` |",
            example: "**Business Application:** A logistics manager uses `=1-NORM.DIST(48, 40, 5, TRUE)` to find the probability that a shipment will take more than 48 hours to arrive.",
            proTip: "The 'TRUE' argument tells Excel to calculate the **cumulative** probability (area to the left)."
          }
        },
        {
          id: "zscore",
          name: "Z-score Logic",
          def: "Standardizing data values into standard deviations from the mean.",
          tag: "The Level Scale",
          image: DEFAULT_IMAGE,
          details: {
            title: "Standardization",
            math: "$Z = \\frac{X - \\mu}{\\sigma}$",
            example: "**Business Application:** A financial analyst calculates Z-scores for stock returns to identify 'outlier' days that might signal a market crash or bubble.",
            proTip: "A Z-score above 3 or below -3 is generally considered a significant outlier."
          }
        }
      ]
    },
    {
      title: "Bayes' Theorem",
      icon: <Calculator className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      items: [
        {
          id: "bayes",
          name: "Bayes' Theorem",
          def: "A mathematical formula used to determine the conditional probability of an event based on prior knowledge of conditions that might be related to the event.",
          tag: "The Probability Update",
          image: DEFAULT_IMAGE,
          details: {
            title: "Conditional Probability Formula (Bayes' Theorem)",
            math: "$P(A|B) = \\frac{P(B|A) P(A)}{P(B|A) P(A) + P(B|A^c) P(A^c)}$\n\nWhere:\n- **$P(A|B)$**: Posterior Probability (Probability of A knowing B occurred)\n- **$P(A)$**: Prior Probability (Initial probability of A)\n- **$P(B|A)$**: Likelihood (Probability of seeing B if A is true)\n- **$P(A^c)$**: Probability that A does not occur (Complement)",
            example: "**Business Application:** An insurance firm uses Bayes' to calculate the probability a driver is 'High Risk' $(A)$ given they had an accident $(B)$, using historical data of accident rates among high-risk vs low-risk groups.",
            proTip: "The denominator is simply the 'Total Probability' of event B occurring across all possible states."
          }
        }
      ]
    },
    {
      title: "Tests & Intervals",
      icon: <Sigma className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      items: [
        {
          id: "ci",
          name: "Confidence Intervals (Z vs T)",
          def: "A range of values used to estimate the true population parameter with a specific level of certainty.",
          tag: "The Range Builder",
          image: DEFAULT_IMAGE,
          details: {
            title: "CI Decision Matrix",
            math: "| Component | Pop. $\\sigma$ Known (Z) | Pop. $\\sigma$ Unknown (T) |\n| :--- | :--- | :--- |\n| **Point Estimate** | Sample mean $\\bar{x}$ | Sample mean $\\bar{x}$ |\n| **Critical Value** | $Z^*$ values below | $t^*$ (Degrees of Freedom: $n-1$) |\n| **Standard Error** | $\\sigma / \\sqrt{n}$ | $s / \\sqrt{n}$ ($s$ is sample SD) |\n| **Margin of Error** | $Z^* \\times (\\sigma / \\sqrt{n})$ | $t^* \\times (s / \\sqrt{n})$ |\n| **Final Formula** | $\\bar{x} \\pm Z^* \\frac{\\sigma}{\\sqrt{n}}$ | $\\bar{x} \\pm t^* \\frac{s}{\\sqrt{n}}$ |\n\n**Common $Z^*$ Values:**  \n- 90% Confidence: **1.645**\n- 92% Confidence: **1.751**\n- 95% Confidence: **1.960**\n- 98% Confidence: **2.326**\n- 99% Confidence: **2.576**\n\n**Excel Syntax for T-Interval:**\n- Get $t^*$: `=T.INV.2T(alpha, df)` where $\\alpha = 1 - \\text{Confidence Level}$.",
            example: "**Business Application:** A quality control manager uses a Z-interval if machine precision ($\\sigma$) is known. If only the current sample SD ($s$) is available, they use the T-interval.",
            proTip: "Use the T-distribution whenever you have to estimate $\\sigma$ using the sample standard deviation $s$. Remember $df = n - 1$."
          }
        },
        {
          id: "hypotheses",
          name: "Hypothesis Testing (Z-Test)",
          def: "A 4-step procedure to decide whether there is enough evidence to reject a status quo claim when σ is known.",
          tag: "The Verdict",
          image: DEFAULT_IMAGE,
          details: {
            title: "Z-Test Strategic Protocol",
            math: "### 1. The 4-Step Process\n1. **Hypothesize:** Specify $H_0$ (contains equality) and $H_A$ (the alternative).\n2. **Significance:** Specify $\\alpha$ (standard level of risk, e.g., 0.05).\n3. **Calculate:** Find test statistic $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$ and the p-value.\n4. **Conclusion:** State verdict using the p-value rule.\n\n### 2. Probability Decision Matrix\n| Alternative ($H_A$) | Z-Table (Find P) | Excel Syntax (p-value) |\n| :--- | :--- | :--- |\n| **Lower ($H_A: \\mu < \\mu_0$)** | Prob. from table | `=NORM.DIST(z,0,1,TRUE)` |\n| **Upper ($H_A: \\mu > \\mu_0$)** | $1 - \\text{Prob.}$ | `=1-NORM.DIST(z,0,1,TRUE)` |\n| **Two-Tail ($H_A: \\mu \\neq \\mu_0$)** | *See Rule Below* | *See Rule Below* |\n\n**Two-Tail Rule:**\n- **If $z > 0$:** $2 \\times (1 - \\text{Prob.})$ OR `=2*(1-NORM.DIST(z,0,1,TRUE))`\n- **If $z < 0$:** $2 \\times \\text{Prob.}$ OR `=2*NORM.DIST(z,0,1,TRUE)`\n\n### 3. Final Conclusion Logic\n- **If p-value $\\le \\alpha$:** Then we **reject $H_0$**, **fail to reject $H_A$**, we **can support** the conclusion.\n- **If p-value $> \\alpha$:** Then we say that we **fail to reject $H_0$**, **reject $H_A$**, we **cannot support** the conclusion.",
            example: "**Business Application:** A pharmacy chain tests whether a new generic drug is as effective as the brand name by setting the null hypothesis as 'No Difference'.",
            proTip: "The p-value is the probability of seeing your sample results if the status quo (Null) is true."
          }
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-600 p-2.5 rounded-xl rotate-3 shadow-lg shadow-blue-200">
          <Book className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight italic">Stats Knowledge Base</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Professional Math Logic API</p>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <div className={`flex items-center gap-2 ${section.color} font-black uppercase text-sm tracking-[0.2em] px-2`}>
              <div className={`${section.bg} p-2 rounded-lg border border-slate-100 shadow-sm`}>
                {section.icon}
              </div>
              {section.title}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, iIdx) => (
                <div 
                  key={iIdx} 
                  className="high-density-card hover:scale-[1.02] transition-all cursor-pointer group flex flex-col overflow-hidden border-2 hover:border-blue-400 active:scale-95 bg-white shadow-xl shadow-slate-100/50"
                  onClick={() => setSelectedItem(item as StudyItem)}
                >
                  <div className="relative h-44 mb-4 -mx-5 -mt-5 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/20 to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 flex flex-col">
                       <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-0.5">{item.tag}</div>
                       <div className="text-white font-black text-base uppercase leading-tight tracking-tight">{item.name}</div>
                    </div>
                    <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl rounded-full text-white border border-white/20">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <p className="text-[11px] leading-relaxed text-[#64748b] font-semibold flex-1">
                    {item.def}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Type: {section.title.split(' ')[0]}</span>
                    <div className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-tighter transition-colors group-hover:bg-blue-600 group-hover:text-white">Learn More</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Deep Dive Overlay */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-20 duration-500 border border-slate-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Image */}
            <div className="relative h-56">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all hover:rotate-90 z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-8 flex flex-col z-10">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-1">{selectedItem.tag}</div>
                  <h2 className="text-3xl font-black text-[#1e293b] leading-none uppercase tracking-tighter">{selectedItem.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 max-h-[65vh] overflow-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Technical Definition</div>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed">{selectedItem.def}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest italic ml-1">
                    <Calculator className="w-4 h-4" />
                    Math Logic & Formulas
                  </div>
                  <div className="text-sm font-medium bg-slate-900 p-5 rounded-2xl border-4 border-blue-500/20 text-blue-50 overflow-x-auto shadow-xl">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {selectedItem.details.math}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest px-1 flex items-center gap-2">
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       Case Study
                    </div>
                    <div className="text-xs text-slate-600 bg-green-50/50 p-4 rounded-2xl border border-green-100 leading-relaxed font-semibold overflow-x-auto">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {selectedItem.details.example}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-1 flex items-center gap-2">
                       <Target className="w-3.5 h-3.5" />
                       Exam Secret
                    </div>
                    <div className="text-xs text-slate-600 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 leading-relaxed font-semibold overflow-x-auto">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath, remarkGfm]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {selectedItem.details.proTip}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setSelectedItem(null)}
                className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-black py-8 rounded-2xl transition-all shadow-[0_8px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-2 uppercase tracking-[0.2em] text-xs border-b-2 border-slate-700"
              >
                Close Deep Dive
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
