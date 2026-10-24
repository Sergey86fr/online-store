// Пагинация для ручек со списками: ?page=2&limit=20

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface IPagination {
  page: number;
  limit: number;
  skip: number; // сколько записей пропустить: (page - 1) * limit
}

// Ответ ручки со списком: сами записи + сколько их всего (чтобы фронт посчитал страницы)
export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Читает page и limit из query-параметров.
// Возвращает строку с ошибкой, если параметры некорректные.
export const parsePagination = (searchParams: URLSearchParams): IPagination | string => {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam === null ? 1 : Number(pageParam);
  const limit = limitParam === null ? DEFAULT_LIMIT : Number(limitParam);

  if (!Number.isInteger(page) || page < 1) {
    return "page должен быть целым числом от 1";
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return `limit должен быть целым числом от 1 до ${MAX_LIMIT}`;
  }

  return { page, limit, skip: (page - 1) * limit };
};

export const toPaginatedResponse = <T>(
  items: T[],
  total: number,
  { page, limit }: IPagination
): IPaginatedResponse<T> => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
