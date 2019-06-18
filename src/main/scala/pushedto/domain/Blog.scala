package pushedto.domain

import java.time.Instant

object values {

  case class Id(
    owner: String,
    project: String)

  case class Social(
    twitter: Option[String],
    linkedIn: Option[String],
    github: Option[String])

  case class Owner(
    name: String,
    avatar: String,
    company: Option[String],
    location: Option[String],
    website: Option[String],
    social: Social)

  case class Configuration(
    googleAnalyticsId: Option[String],
    disqusId: Option[String])

  case class BlogProperties(
    id: Id,
    title: String,
    topics: List[String],
    description: Option[String],
    owner: Option[String],
    config: Configuration)

  case class HTML(
    value: String)

  case class Post(
    key: String,
    title: String,
    topics: List[String],
    author: String,
    lastModified: Instant,
    published: Instant,
    preview: HTML,
    content: HTML)

}

object commands {

  import values._

  case class UpdateProperties(properties: BlogProperties)

  case class UpsertPost(post: Post)

  case class DeletePost(key: String)

}

class Blog {

}
