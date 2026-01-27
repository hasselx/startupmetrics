interface CategoryChipProps {
  name: string;
  icon: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryChip = ({ name, icon, isActive = false, onClick }: CategoryChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`category-chip tap-highlight-none whitespace-nowrap ${isActive ? 'active' : ''}`}
    >
      <span className="mr-1.5">{icon}</span>
      <span>{name}</span>
    </button>
  );
};

export default CategoryChip;
