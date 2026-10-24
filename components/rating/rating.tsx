import Star from "../../public/images/icons/star.svg";

interface IRatingProps {
  rating: number;
}

const Rating = ({ rating }: IRatingProps) => {
  const stars = [];

  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    const fillPercent = Math.min(Math.max(rating - (i - 1), 0), 1) * 100;
    stars.push(
      <div className="relative w-[13px] h-[13px] " key={i}>
        <Star className='text-[#BFBFBF] w-full h-full absolute inset-0' />
        <div className="absolute  overflow-hidden inset-0 " style={{width:`${fillPercent}%`}}>
            <Star className='text-(--color-primary) w-[13px] h-[13px]' />
            </div>
      </div>,
    );
  }

  return (
    <div className="flex gap-1">
      {stars}
    </div>
  );
};

export default Rating;
