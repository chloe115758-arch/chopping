import Feed from "@/components/Feed";

// /?empty=1 로 빈 피드 화면을 시연할 수 있다
export default async function Home({ searchParams }: PageProps<"/">) {
  const { empty } = await searchParams;
  return <Feed empty={empty !== undefined} />;
}
