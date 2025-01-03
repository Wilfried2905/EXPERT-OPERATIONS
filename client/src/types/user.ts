import { z } from 'zod';

export const UserRole = z.enum(['guest', 'technician', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

export const UserStatus = z.enum(['active', 'inactive']);
export type UserStatus = z.infer<typeof UserStatus>;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: UserRole,
  status: UserStatus,
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
