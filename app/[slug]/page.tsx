interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: PageProps) {
  const slug = (await params).slug
  const now = new Date().toISOString();

  return <div>
    <span>This page ({slug}) was generated on <b>{now}</b></span>
  </div>
}
