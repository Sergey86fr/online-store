import { ILocation } from "@/types/location";

export const locations: ILocation[] = [
  {
    id: 1,
    center: [53.41, 59.0],
    city: "Magnitogorsk",
    title: "Магнитогорск",
    stores: [
      { id: 1, name: "на континенте", marker: [53.4026, 58.9876] },
      { id: 2, name: "семейный парк", marker: [53.3787, 58.9763] },
      { id: 3, name: "гостиный двор", marker: [53.3788, 58.9811] },
    ],
  },
  {
    id: 2,
    center: [53.96, 58.41],
    city: "Beloretsk",
    title: "Белорецк",
    stores: [{ id: 4, name: "на Пушкина", marker: [53.9685, 58.4156] }],
  },
];