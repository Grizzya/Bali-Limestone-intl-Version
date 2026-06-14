import { prisma } from "@/lib/prisma";
import ReviewClient from "./ReviewClient";

export const revalidate = 0;

export default async function Review() {
  // Tarik data testimoni terbaru dari database
  const testimoni = await prisma.testimoni.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ReviewClient initialReviews={testimoni} />;
}