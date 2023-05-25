import { z } from 'zod';

export const MovieNameEnSchema = z.string().max(100, '电影英文名最大长度不可超过100');
