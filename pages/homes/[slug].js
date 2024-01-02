// pages/homes/[id].js

import Image from 'next/image';
import Layout from '@/components/Layout';
import { PrismaClient } from '@prisma/client';
// Import the useRouter hook from Next
import { useRouter } from 'next/router';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const ListedHome = (home = null) => {
  // Retrieve the Next.js router
  const router = useRouter();
  
  // Fallback version
  // Get Static Props proccess maybe taking time, so instead of serving an empty view, we can set the loading
  if (router.isFallback) {
  	return 'Loading...'; 
  }

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ''}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{home?.description ?? ''}</p>
      </div>
    </Layout>
  );
};

// We define all availables id to nextJS, so it can be mapped in the build time as a Static Generation
export async function getStaticPaths() {
    // Get all the homes IDs from the database
    const homes = await prisma.home.findMany({
        select: { slug: true },
    });

    console.log(homes,"<<<<<< 1")

    return {
        paths: homes.map(home => ({
            params: { slug: home.slug },
        })),
        // Active the fallback for server static generated content on the fly
        fallback: true,
    };
}

export async function getStaticProps({ params }) {

    console.log(params,"<<<<<< 2")

    // Get the current home from the database
    const home = await prisma.home.findUnique({
      where: { slug: params.slug },
    });
  
    if (home) {
      return {
        props: JSON.parse(JSON.stringify(home)),
      };
    }
  
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

export default ListedHome;