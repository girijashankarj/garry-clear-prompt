import type { ImprovePromptIntent } from '@/common/messages/improve-checklists';

/**
 * Single primary intent for improver checklists. Technical and compliance-heavy
 * signals are checked before general writing (see `ImprovePromptIntent` order below).
 */
export function detectPrimaryImproveIntent(text: string): ImprovePromptIntent | null {
  const t = text;
  if (matchesSql(t)) return 'sql';
  if (matchesCode(t)) return 'code';
  if (matchesOps(t)) return 'ops';
  if (matchesProduct(t)) return 'product';
  if (matchesResearch(t)) return 'research';
  if (matchesAnalysis(t)) return 'analysis';
  if (matchesLegal(t)) return 'legal';
  if (matchesEducation(t)) return 'education';
  if (matchesDataviz(t)) return 'dataviz';
  if (matchesCreative(t)) return 'creative';
  if (matchesTranslation(t)) return 'translation';
  if (matchesWriting(t)) return 'writing';
  return null;
}

function matchesSql(s: string): boolean {
  if (/\bSELECT\b/i.test(s) || /\bsql\b/i.test(s)) return true;
  if (/\bdatabase\b/i.test(s) && /\btable\b/i.test(s)) return true;
  if (/\bFROM\b/i.test(s) && /\bWHERE\b/i.test(s)) return true;
  if (/\bschema\b/i.test(s) && /\btable\b/i.test(s)) return true;
  if (/\bquery\b/i.test(s) && /\b(from|database|table|select|join)\b/i.test(s)) return true;
  return false;
}

function matchesCode(s: string): boolean {
  return /\b(refactor|debug|implement|typescript|javascript|python|java|rust|golang|react|vue|angular|svelte|component|endpoint|API|npm|node\.js|jest|vitest|eslint|compiler|stack\s+trace|exception|pull\s+request|unit\s+test|integration\s+test)\b/i.test(
    s
  );
}

function matchesOps(s: string): boolean {
  return /\b(kubernetes|k8s|docker|container|terraform|ansible|jenkins|github\s+actions|gitlab\s+ci|CI\/CD|deploy(ment)?|pipeline|helm|argocd|prometheus|grafana|datadog|infrastructure|observability|SLA|SRE|uptime|rollback|load\s+balancer|ingress)\b/i.test(
    s
  );
}

function matchesProduct(s: string): boolean {
  return /\b(PRD|user\s+stor(y|ies)|acceptance\s+criteria|roadmap|feature\s+spec|product\s+requirements|epic|stakeholder|OKRs?|use\s+cases?|MVP|go-to-market|GTM)\b/i.test(
    s
  );
}

function matchesResearch(s: string): boolean {
  return /\b(cite|citations?|sources?|bibliograph|literature|peer\s*review|whitepaper|case\s+stud(y|ies)|papers?|studies|research\s+papers?|primary\s+sources?|verify\s+facts|fact-?check|systematic\s+review|meta-?analysis)\b/i.test(
    s
  );
}

function matchesAnalysis(s: string): boolean {
  return /\b(compare|compar(e|ing|ison)|analy[sz]e|analy[sz]ing|evaluation|trade-?offs?|pros\s+and\s+cons|versus|vs\.|which\s+is\s+better|which\s+should|cost-?benefit|SWOT)\b/i.test(
    s
  );
}

function matchesLegal(s: string): boolean {
  return /\b(contract|NDA|non-?disclosure|terms\s+of\s+service|privacy\s+policy|GDPR|CCPA|HIPAA|SOX|regulatory|compliance\s+audit|legal\s+hold|subpoena|not\s+legal\s+advice|attorney|counsel|indemnif|liabilit(y|ies)|warrant(y|ies))\b/i.test(
    s
  );
}

function matchesEducation(s: string): boolean {
  return /\b(teach|tutorial|lesson|syllabus|curriculum|quiz|homework|exam\s+prep|study\s+guide|course\s+module|for\s+students|learners?|pedagog|scaffolding|worksheet|flashcards)\b/i.test(
    s
  );
}

function matchesDataviz(s: string): boolean {
  return /\b(chart|charts|graph|graphs|plot|plots|matplotlib|ggplot|seaborn|d3\.js|tableau|power\s+bi|looker|dashboard|visuali[sz]ation|infographic|histogram|scatterplot|heatmap)\b/i.test(
    s
  );
}

function matchesCreative(s: string): boolean {
  return /\b(screenplay|short\s+story|novel|fiction|fanfiction|fan\s+fic|poem|poetry|lyrics|song\s+about|world-?building|character\s+sheet|creative\s+writing|brainstorm\s+(a\s+)?(plot|title|names))\b/i.test(
    s
  );
}

function matchesTranslation(s: string): boolean {
  return /\b(translate\s+(this|that|the\s+following|into|to|from)|translation\s+of|localization|localisation|bilingual|multilingual|target\s+language|source\s+language)\b/i.test(
    s
  );
}

function matchesWriting(s: string): boolean {
  return /\b(email|blog|essay|article|newsletter|brochure|tweet|headline|tagline|slogan|copywriting|marketing\s+copy|press\s+release|linkedin|for\s+twitter)\b/i.test(
    s
  );
}
