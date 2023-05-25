import { z } from 'zod';
import { SiteNameSchema } from '@/app/setting/schemas/fields/site.name.schema';
import { SiteSubNameSchema } from '@/app/setting/schemas/fields/site.sub.name.schema';
import { SiteSignatureSchema } from '@/app/setting/schemas/fields/site.signature.schema';
import { SiteCopyrightSchema } from '@/app/setting/schemas/fields/site.copyright.schema';
import { SiteRecordNoSchema } from '@/app/setting/schemas/fields/site.record.no.schema';
import { UrlSchema } from '@/schemas/fields/url.schema';

export const SettingUpdateSchema = z.object({
  siteName: SiteNameSchema.optional(),
  siteSubName: SiteSubNameSchema.optional(),
  siteSignature: SiteSignatureSchema.optional(),
  siteCopyright: SiteCopyrightSchema.optional(),
  siteRecordNo: SiteRecordNoSchema.optional(),
  siteRecordUrl: UrlSchema.optional(),
});
