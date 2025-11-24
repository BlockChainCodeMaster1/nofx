import { Search, X } from 'lucide-react'

interface FAQSearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export function FAQSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Search FAQ...',
}: FAQSearchBarProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-darkmoon-text-secondary"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 rounded-lg text-base transition-all focus:outline-none focus:ring-2 bg-darkmoon-surface border border-darkmoon-border text-darkmoon-text-primary focus:border-darkmoon-gold focus:ring-darkmoon-gold/10"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity text-darkmoon-text-secondary"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
