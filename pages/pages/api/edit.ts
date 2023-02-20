import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  categoryIds: yup.array().of(yup.number()),
});

const EditPostPage = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const { id } = router.query;
  const { data } = useQuery(['post', id], () =>
    axios.get(`/api/posts/${id}`).then((res) => res.data)
  );
  const mutation = useMutation(
    (updatedPost) =>
      axios.put(`/api/posts/${id}`, updatedPost).then((res) => res.data),
    {
      onSuccess: () => {
        router.push('/dashboard');
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setValue('title', data.title);
      setValue('description', data.description);
      setSelectedCategories(data.categories);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const updatedPost = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      categoryIds: selectedCategories,
    };
    await mutation.mutateAsync(updatedPost);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (data?.authorId !== session.user.id) {
    return <div>You do not have permission to edit this post.</div>;
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" {...register('title')} />
          {errors.title && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea {...register('description')} />
          {errors.description && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="categories">Categories</label>
          <select
            multiple
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                )
              )
            }
          >
            {data?.allCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Update Post</button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
