interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalf) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  const sizeClass = size === 'md' ? 'text-base' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {stars.map((type, i) => (
        <span key={i}>
          {type === 'full' && <span className="text-amber-400">★</span>}
          {type === 'half' && <span className="text-amber-400">★</span>}
          {type === 'empty' && <span className="text-gray-200">★</span>}
        </span>
      ))}
    </span>
  );
}
