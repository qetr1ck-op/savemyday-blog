import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

const PageList = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        nodes {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  `)
  const pages = data.allMarkdownRemark.nodes.map(node => node.frontmatter)

  return (
    <div>
      <ul>
        {pages.map(page => {
          return (
            <li>
              <Link to={page.path}>{page.title}</Link> - published {page.date}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PageList
