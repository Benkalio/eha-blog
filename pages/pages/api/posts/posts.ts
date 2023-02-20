import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';
import { getSession } from 'next-auth'
import { Post, User } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, content, image, categories } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        author: { connect: { id: user.id } },
        categories: {
          connectOrCreate: categories?.map((category: any) => ({
            where: { slug: category.slug },
            create: { name: category.name, slug: category.slug },
          })),
        },
      },
      include: { categories: true },
    });

    return res.status(200).json()
