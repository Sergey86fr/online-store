import Link from 'next/link'
import Favorites from "../../public/images/header/favorites.svg";
import Orders from "../../public/images/header/orders.svg";
import Cart from "../../public/images/header/shopping-cart.svg";
import Burger from "../../public/images/header/burger-menu-mob.svg";

const TopMenu = () => {
  
  return (
     <ul className="flex flex-1  items-center gap-9 md:gap-6 ">
       <li className='block md:hidden'>
         <Link className='hover:text-[#bfbfbf]' href={"/catalog"}>
          <Burger alt="Меню" className="w-6 h-6" />
        </Link>
       </li>
       <li>
         <Link className='flex flex-col items-center gap-2 hover:text-[#bfbfbf]' href={""} >
          <Favorites alt="Меню" className="w-6 h-6" />
          <span>Избранное</span>
        </Link>
       </li>
      <li>
          <Link  className='flex flex-col items-center gap-2 hover:text-[#bfbfbf]' href={"/orders"}>
          <Orders alt="Меню" className="w-6 h-6" />
          <span>Заказы</span>
        </Link>
      </li>
       <li>
         <Link  className='flex flex-col items-center gap-2 hover:text-[#bfbfbf]' href={""}>
          <Cart alt="Меню" className="w-6 h-6" />
          <span>Корзина</span>
        </Link>
       </li>
      </ul>
  )
}

export default TopMenu