// "use client";

// import { rejects } from "assert";
// import { resolve } from "path";
// import { useEffect, useState } from "react";

// import { FormEvent, useActionState, useState } from "react";

// // import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"

// // interface ICartItemsType {
// //      product: IProduct;
// //     count: number;
// // }

// // interface ICartActionsType {
// //      add: (product) => void;
// //     remove: (id) => void;
// // }
// //  const CartItemsContext = createContext< ICartItemsType[] | null >([]);

// //  const CartActionsContext = createContext< ICartActionsType | null >(null);

// // interface ICustomCartProviderProps {
// //     children: ReactNode;
// // }

// // export const CustomCartProvider = ({children}:ICustomCartProviderProps) => {
// //     const[items, setItems ] = useState<ICartItem[]>([])

// //     const add = (product: ICartItem) => {
// //         setItems((prev) => [...prev, product])
// //     }
// //     const remove = (id: string) => {
// //         setItems((prev) => prev.filter((p) => p.product.id !== id))
// //     }

// //     const actions = useMemo(() => {
// //       return {
// //           add,
// //         remove
// //       }
// //     },[])

// //     return (
// //         <CartItemsContext.Provider value={items}>
// //           <CartActionsContext.Provider value={actions}>
// //             {children}
// //           </CartActionsContext.Provider>
// //         </CartItemsContext.Provider>
// //     )
// // }

// // export const useCartActions = ():ICartActionsType => {
// //    const context = useContext(CartActionsContext)
// //    if(!context) {
// //     throw new Error('контекс нельэя вызывать ане провайдера')
// //    }
// //    return context
// // }

// // const ReviewForm = () => {
// //     const [ rating, setRating ]= useState(5)

// //     const handleSubmitForm = (e:FormEvent<HTMLFormElement>) => {
// //         e.preventDefault()
// //       const form = new FormData(e.currentTarget)
// //       const text = form.get("text")
// //       const rating = form.get("rating")
// //       console.log(text, rating);

// //     }

// //     return (
// //         <form onSubmit={handleSubmitForm}>
// //             <select name="rating"  value={rating} onChange={((e) => setRating(Number(e.target.value)))}>
// //                 <option value="1">1</option>
// //                 <option value="2">2</option>
// //                 <option value="3">3</option>
// //                 <option value="4">4</option>
// //                 <option value="5">5</option>
// //             </select>

// //             <textarea defaultValue={''} name="text" required></textarea>

// //             <button type="submit"></button>
// //         </form>
// //     )
// // }

// // export default ReviewForm;

// // ("use server");

// // import { updateTag } from "next/cache";

// // export async function cancelOrder(orderId: string) {
// //   // ← ваши проверки здесь

// //   const user = await getCurrentUser();
// //   if (!user) throw new Error("пользователь не авторизован");
// //   const { id } = user;
// //   const order = await Order.findById(orderId);
// //   if (!order) throw new Error("заказ не найден");
// //   const { userId, status } = order;
// //   if (id !== userId) throw new Error("не тот заказ");

// //   if (status !== "pending") throw new Error("заказ нельзя отменить");
// //   await Order.updateOne({ _id: orderId }, { $set: { status: "cancelled" } });
// //   updateTag(`orders-${order.userId}`);
// // }

// "use server"

// export async function addReview(prevState: {error?:string;ok?:boolean; fields?:{rating:number, text:string}}, formData:FormData)  {
//   const rating = Number(formData.get("rating"));
//   const text = String(formData.get("text") ?? "");
//   if(!Number.isInteger(rating) || rating < 1 || rating > 5) return {error: "Поставьте оценку", fields: { rating, text }};
//   if(text.trim().length < 10) return { error: "Отзыв слишком короткий" , fields: { rating, text } };
//   await db.addReview({rating, text});
//   return {ok: true}

// }
// "use client"
// import { useFormStatus } from "react-dom";

// function SubmitButton() {
//   const{pending}=useFormStatus()
//   return  <button disabled={pending}>{pending ? "Отправка..." : "Отправить"}</button>
// }

// "use client"

// import { useActionState } from "react"

// function ReviewForm() {
// const [state, formAction] = useActionState(addReview, {});

// return <form action={formAction}>
//   {state.error && <span>{state.error}</span>}
//   {state.ok && <p>Спасибо за отзыв!</p>}
//   <select defaultValue={String(state.fields?.rating ?? "")} name="rating">
//     <option value="">Оценка</option>
//     <option value="1">1</option>
//     <option value="2">2</option>
//     <option value="3">3</option>
//     <option value="4">4</option>
//     <option value="5">5</option>
//   </select>
//   <textarea defaultValue={state.fields?.text} name="text" />
//  <SubmitButton />
// </form>
// }

// export default ReviewForm

// interface IProduct {
//   id: string;
//   title: string;
//   price: number;
//   quantity: number;
// }

// type MyPick<T, K extends keyof T> = {[P in K]:T[P]}

// // 1. Напишите свой MyPick<T, K> — аналог встроенного Pick
// // 2. Что получится в типе ниже? Распишите поля
// type Card = MyPick<IProduct, "id" | "title">;

// // 3. Почему вот это должно дать ошибку и благодаря чему именно?
// type Broken = MyPick<IProduct, "color">;

// function PromiseAll(items) {
//      return new Promise((resolve, reject) => {
//         if(items.length === 0) resolve([])
//         const res = [];
//         let count = 0;
//         items.forEach((i, index) => {
//             Promise.resolve(i).then(
//                 (value) => {
//                 res[index] = value;
//                 count +=1;
//                 if(count === items.length) resolve(res)
//             },
//             reject
//         )
//         })
//      })
// }

// export function useDebounce<T>(value: T, delay: number) {
//   const [debounceValue, setDebounceValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebounceValue(value);
//     }, delay);
//     return () => clearTimeout(timer);
//   }, [delay, value]);
//   return debounceValue;
// }

// function myForEach<T> (arr:T[],callback:(item:T, index:number, array:T[]) => void):void {
//       const firstLengthArray = arr.length;
//       for(let i =0; i < firstLengthArray; i++) {
//         if(i in arr) {
//             callback(arr[i], i, arr)
//         }
//       }
// }

// declare global {
//   interface Array<T> {
//     myForEach(callback: (item: T, i: number, array: T[]) => void): void;
//   }
// }

// Array.prototype.myForEach= function(callback) {
//   const firstLengthArray = this.length;
//   for (let i = 0; i < firstLengthArray; i++) {
//     if (i in this) {
//       callback(this[i], i, this);
//     }
//   }
// }

// function myMap<T,U>(arr: T[], callback: (item:T, index:number, array:T[]) => U): U[] {
//   const firstLengthArray = arr.length;
//   const res: Array<U> = new Array(firstLengthArray)
//   for(let i = 0; i < firstLengthArray; i++) {
//     if(i in arr) {
//         const newItem = callback(arr[i], i, arr)

//      res[i] = newItem
//     }
//   }
//   return res
// }

// function myFilter<T>(array:T[], callback:(item:T, index:number, arr:T[]) => unknown) {

//     const firstLengtarray = array.length
//   const res:T[]=[];

//   for(let i = 0; i < firstLengtarray; i++) {
//     if(i in array) {
//         if(callback(array[i], i, array) ) {
//             res.push(array[i])
//         }

//     }

//   }
//   return res
// }

// function myReduce<T, U>(
//   arr: T[],
//   callback: (acc: U, item: T, index: number, arr: T[]) => U,
//   initialValue?: U,
// ) {
//   let acc = initialValue as U;
//   let start = 0;
//   const firstLengthArray = arr.length;
//   if (arguments.length < 3) {
//     for (let i = 0; i < firstLengthArray; i++) {
//       if (i in arr) {
//         acc = arr[i] as unknown as U;
//         start = i + 1;
//         break;
//       }
//     }
//     if (start === 0) {
//       throw new TypeError("Ошибка");
//     }
//   }
//   for (let i = start; i < firstLengthArray; i++) {
//     if (i in arr) {
//       acc = callback(acc, arr[i], i, arr);
//     }
//   }
//   return acc;
// }

// function myBind(fn:Function, ctx: unknown, ...args:unknown[]) {

//     const bindFn = (...rest:unknown[]) => {

//         return fn.call(ctx,...args, ...rest)
//     }
//     return bindFn

// }

// function throttle(fn: Function, ms: number) {
//   let isReady = true;
//   return (...rest: unknown[]) => {
//     if (isReady) {
//       isReady = false;
//       setTimeout(() => {
//         isReady = true;
//       }, ms);
//       return fn(...rest);
//     }
//   };
// }

// if (!isReady) return;
// isReady = false;
// setTimeout(() => { isReady = true; }, ms);
// return fn(...rest);

// function deepClone(obj: unknown, seen = new WeakMap()) {
//     if(typeof obj !== 'object' || obj === null) {
//         return obj
//     }

//     if(obj instanceof Date) {
//         return new Date(obj)
//     }
//     if(seen.has(obj)) {
//         return seen.get(obj)
//     }

//  const copyObj = Array.isArray(obj) ? [] : {};
//  seen.set(obj, copyObj )

//     for(const key in obj) {
//             copyObj[key] =  deepClone(obj[key], seen)
//         }

//     return copyObj
// }

// const arr = [1, [2, [3, [4]]], 5];

// arr.flat();          // а)[1,2,[3,[4]],5]
// arr.flat(2);         // б)[1,2,3,[4],5]
// arr.flat(Infinity);  // в)[1,2,3,4,5]
// arr.flat(0);         // г)[1,2,3,4,5]
// [1, , 3, [4, , 6]].flat(); // д) — с «дырками»[1, , ,3,4, , ,6]

// function myFlat<T>(arr:T[], depth:number=1) {

//     const deepArr = [];

//     for(let i= 0; i < arr.length; i++) {
//         if(!(i in arr)) {
//             continue
//         }
//         if(Array.isArray(arr[i]) && depth > 0) {
//             deepArr.push(...myFlat(arr[i], depth-1))

//         } else {
//             deepArr.push(arr[i])
//         }
//     }
//     return deepArr

// }

// function memoize<A,R>(fn: (arg: A) => R) {
//   const map:Map<A,R> = new Map();

//   return (arg: A) => {
//     if (map.has(arg)) {
//       return map.get(arg) as R;
//     } else {
//       const res = fn(arg);
//       map.set(arg, res);
//       return res;
//     }
//   };
// }

// function slowSquare(n: number) {
//   console.log("считаю", n);
//   return n * n;
// }

// const fastSquare = memoize(slowSquare);

// console.log(fastSquare(4)); // "считаю 4", затем 16
// console.log(fastSquare(4)); // только 16 — без "считаю"
// console.log(fastSquare(5)); // "считаю 5", затем 25
