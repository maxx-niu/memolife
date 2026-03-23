import FileUpload from "@/app/components/dashboard/documents/file-upload";
import SearchBar from "@/app/components/dashboard/search-bar";
import FileList from "@/app/components/dashboard/documents/file-list";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-24">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          What do you want to remember?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search across your documents using natural language
        </p>
      </div>
      <SearchBar />
      <FileUpload />
      <FileList />
    </div>
  );
}
