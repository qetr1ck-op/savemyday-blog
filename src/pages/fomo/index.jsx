import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

const mdPages = graphql`
  query {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fields: { source_type: { eq: "fomo-pages" } } }
    ) {
      nodes {
        frontmatter {
          title
          path
        }
        excerpt(format: PLAIN)
      }
    }
  }
`

const FomoPages = () => {
  const {
    allMarkdownRemark: { nodes: fomoList },
  } = useStaticQuery(mdPages)

  return (
    <Layout>
      <SEO title="Home" />
      <h1>FOMO list</h1>

      <ul>
        {fomoList.map(({ frontmatter: { title, path } }) => {
          return (
            <li key={title}>
              <Link to={`${path}`}>{title}</Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default FomoPages
