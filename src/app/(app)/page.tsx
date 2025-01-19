import FileUpload from "./components/file-upload";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">File Preview</h1>
      <FileUpload />
    </main>
  );
}