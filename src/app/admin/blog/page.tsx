import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminBlogPage() {
  const posts = useQuery(api.posts.listAll) || [];
  const updatePost = useMutation(api.posts.update);
  const removePost = useMutation(api.posts.remove);

  const handleTogglePublished = async (id: Id<"posts">, published: boolean) => {
    await updatePost({ id, published: !published });
  };

  const columns = [
    { key: "title", label: "Title", render: (item: Record<string, unknown>) => (
      <Link href={`/admin/blog/${item._id}/edit`} className="font-medium text-white hover:text-accent-blue transition-colors">
        {String(item.title)}
      </Link>
    )},
    { key: "slug", label: "Slug", render: (item: Record<string, unknown>) => (
      <span className="text-white/40 font-mono text-xs">/{String(item.slug)}</span>
    )},
    {
      key: "published",
      label: "Status",
      render: (item: Record<string, unknown>) => (
        <button onClick={() => handleTogglePublished(item._id as Id<"posts">, item.published as boolean)}>
          <StatusBadge status={item.published ? "Published" : "Draft"} />
        </button>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: Record<string, unknown>) => (
        <button
          onClick={() => { if (confirm("Delete this post?")) removePost({ id: item._id as Id<"posts"> }); }}
          className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blog Manager</h1>
          <p className="text-sm text-white/40 mt-1">{posts.length} posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts as unknown as Record<string, unknown>[]}
        searchKey="title"
        emptyMessage="No blog posts yet"
      />
    </div>
  );
}
