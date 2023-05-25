import { z } from 'zod';

export const TitleEnSchema = z.string().min(1).max(20, '分类英文名称最大长度不可超过20');
