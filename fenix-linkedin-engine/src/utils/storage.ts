import { SavedPost, PostStatus } from '../types'

const STORAGE_KEY = 'fenix_linkedin_posts'

export function getAllPosts(): SavedPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as SavedPost[]
  } catch {
    return []
  }
}

export function savePost(post: SavedPost): void {
  const posts = getAllPosts()
  const existing = posts.findIndex(p => p.id === post.id)
  if (existing >= 0) {
    posts[existing] = post
  } else {
    posts.unshift(post)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function updatePostStatus(id: string, status: PostStatus): void {
  const posts = getAllPosts()
  const post = posts.find(p => p.id === id)
  if (post) {
    post.status = status
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }
}

export function updatePostContent(id: string, content: string): void {
  const posts = getAllPosts()
  const post = posts.find(p => p.id === id)
  if (post) {
    post.content = content
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
