const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const bloggers = blogs

  const total = bloggers.reduce((a, cV) => {
    return a + cV.likes
  }, 0)

  return total
}

const favoriteBlog = (blogs) => {

  const maxLikes = blogs.reduce((a, cV) => {
    return Math.max(a, cV.likes)
  }, 0)

  const best = blogs.find(blog => {
    return blog.likes === maxLikes
  })

  const bestBlog = {
    title: best.title,
    author: best.author,
    likes: best.likes
  }


  return bestBlog
}

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, 'author')

  const written = Object.keys(authors).slice(0).map(key => (
    {
      author: key,
      blogs: authors[key]
    }))

  const bestBlogger = _.maxBy(written, 'blogs')

  return bestBlogger
}

const mostLikes = (blogs) => {
  let name = ''
  let likes = 0

  const grouped = _.groupBy(blogs, 'author')

  _.forEach(grouped, (key) => {
    const sum = _.sumBy(key, 'likes')

    if (sum > likes) {
      name = key[0].author
      likes = sum
    }
  })

  const bloggerWithMostLikes = {
    author: name,
    likes: likes
  }

  return bloggerWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}