import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validation';

export default function Login() {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();

  async function onSubmit(data) {
    try {
      await login(data);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Email:</label>
      <input name="email" ref={register} />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password:</label>
      <input name="password" type="password" ref={register} />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
