import z from 'zod';
import { protectedProcedure, router } from '../middleware';

export const userCategoriesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', ctx.actor.userId)
        .order('created_at', { ascending: false });

      if (categories.error) {
        return ctx.fail({
          code: 'NOT_FOUND',
          message:
            "We couldn't find any categories in your account. Try creating one to get started!",
        });
      }

      return ctx.ok({
        categories: categories.data,
      });
    } catch (err) {
      return ctx.fail(err);
    }
  }),
  get: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .select('*')
          .eq('id', input.categoryId)
          .eq('user_id', ctx.actor.userId)
          .single();

        if (category.error) {
          return ctx.fail({
            code: 'NOT_FOUND',
            message:
              "We couldn't find the category you're looking for. It may have been moved or deleted.",
          });
        }

        return ctx.ok({
          category: category.data,
        });
      } catch (err) {
        return ctx.fail({
          message:
            'An unexpected error occurred while fetching the category. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Please provide a category name')
          .max(50, 'Category name must be 50 characters or less'),
        icon: z.string().min(1, 'Please select an icon'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .insert({
            name: input.name,
            icon: input.icon,
            user_id: ctx.actor.userId,
          })
          .select('*')
          .single();

        if (!category.data) {
          console.error('Category creation failed:', category.error);
          return ctx.fail({
            message:
              "We couldn't create your category. Please check your connection and try again.",
            code: 'BAD_REQUEST',
          });
        }

        return ctx.ok({
          category: category.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().min(1, 'Category ID is required'),
        name: z
          .string()
          .min(1, 'Please provide a category name')
          .max(50, 'Category name must be 50 characters or less')
          .optional(),
        icon: z.string().min(1, 'Please select an icon').optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .update({ name: input.name, icon: input.icon })
          .eq('id', input.categoryId)
          .eq('user_id', ctx.actor.userId)
          .select('*')
          .single();

        if (!category.data) {
          return ctx.fail({
            message:
              'An unexpected error occurred while updating the category. Please try again.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.ok({
          category: category.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({ categoryId: z.string().min(1, 'Category ID is required') })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const category = await ctx.supabase
          .from('user_categories')
          .delete()
          .eq('id', input.categoryId)
          .eq('user_id', ctx.actor.userId)
          .select('*')
          .single();

        if (!category.data) {
          return ctx.fail({
            message:
              'An unexpected error occurred while deleting the category. Please try again.',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }

        return ctx.ok({
          category: category.data,
        });
      } catch (err) {
        return ctx.fail(err);
      }
    }),
});
