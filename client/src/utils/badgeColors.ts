export const getCategoryBadgeColors = (category: string) => {
  const normalizedCategory = category.toLowerCase().trim();
  
  // Return distinct, low-saturation tint classes for both light and dark modes
  switch (normalizedCategory) {
    case 'coding':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20';
    case 'marketing':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20';
    case 'content writing':
      return 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20';
    case 'email':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20';
    case 'resume':
      return 'bg-stone-100 text-stone-700 dark:bg-stone-500/10 dark:text-stone-400 border border-stone-200 dark:border-stone-500/20';
    case 'sql':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20';
    case 'design':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20';
    case 'social media':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20';
    case 'productivity':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20';
    default:
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20';
  }
};
