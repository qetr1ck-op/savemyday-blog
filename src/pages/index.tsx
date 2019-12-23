import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import { Image } from "../components/image"
import SEO from "../components/seo"
import { MainNav, defaultNavItems } from "../components/main-nav/main-nav"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Index Page</h1>
    <MainNav excludeItems={[defaultNavItems.root.title]} />
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage
