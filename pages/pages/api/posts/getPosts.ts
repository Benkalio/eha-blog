import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../prisma/client';

type postProps = {
  title: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const post: postProps = JSON.parse(req.body)
    if (req.method === 'GET') {
      try {
        if (!post.title.length) {
          return res.status(400).json({ message: 'Title is required' });
        }
        const data = await prisma.post.findMany({
          include: {
            // user: true,
            // comments: true,
            // likes: true,
          },
          orderBy: {
            // createdAt: "description",
          },
        })
        return res.status(200).json(data)
      } catch (error) {
              res.status(403).json({ err: "Error has occurred while making a post" })

        }
    }
  }
