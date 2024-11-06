interface EmojiBadgeProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function EmojiBadge({ emoji, label, isSelected, onClick }: EmojiBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isSelected
          ? 'bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
          : 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      <span>{emoji}</span>
      <span className={isSelected ? 'font-medium' : ''}>{label}</span>
    </button>
  )
}