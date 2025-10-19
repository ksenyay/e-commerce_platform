import ProductPage from "@/components/products/ProductPage";

export default async function Home({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="page-container mt-0">
      <ProductPage id={id} />
    </div>
  );
}
