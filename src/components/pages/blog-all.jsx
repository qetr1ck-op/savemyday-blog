import React from "react"
import { graphql, Link } from "gatsby"

export default function BlogPostListTemplate({ data, pageContext }) {
  const pages = data.allMarkdownRemark.nodes.map(node => node.frontmatter)
  const { pagesLength, currentPage } = pageContext
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < pagesLength

  return (
    <div>
      <ul>
        {pages.map(page => {
          return (
            <li>
              <Link to={`blog/${page.path}`}>{page.title}</Link> - published{" "}
              {page.date}
            </li>
          )
        })}
      </ul>
      <hr />
      {hasPrevPage && (
        <Link
          to={`/blog/pages/${currentPage - 1 === 1 ? "" : currentPage - 1}`}
        >
          Prev page
        </Link>
      )}
      {hasNextPage && (
        <Link to={`/blog/pages/${currentPage + 1}`}>Next page</Link>
      )}
    </div>
  )
}

export const pageQuery = graphql`
  query($limit: Int!, $skip: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        frontmatter {
          path
          title
          date
        }
      }
    }
  }
`
