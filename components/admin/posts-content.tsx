import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPosts, togglePostPublished, deletePost } from "@/app/actions/posts"
import { DeletePostButton, TogglePublishButton } from "@/components/admin/post-actions"
import { PostsFilter } from "@/components/admin/posts-filter"

export async function PostsContent({
  category,
  status,
}: {
  category?: "fixes" | "thoughts" | "general"
  status?: "published" | "draft"
}) {
  const res = await getPosts({ category, status })
  if (!res.success) {
    return (
      <div className="rounded-md border bg-card p-4 text-sm text-destructive-foreground">
        Failed to load posts. Please try again later.
      </div>
    )
  }
  const { data } = res

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsFilter />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No posts found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-[320px] truncate">{post.title}</TableCell>
                    <TableCell className="capitalize">{post.category}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge variant="secondary">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}/edit`} prefetch={true}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <form
                          action={async () => {
                            "use server"
                            await togglePostPublished(post.id)
                          }}
                        >
                          <TogglePublishButton isPublished={post.published} />
                        </form>
                        <form
                          action={async () => {
                            "use server"
                            await deletePost(post.id)
                          }}
                        >
                          <DeletePostButton />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
