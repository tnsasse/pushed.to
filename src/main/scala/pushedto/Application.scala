package pushedto

import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import akka.http.scaladsl.server.{HttpApp, Route}

object WebServer extends HttpApp {

  override protected def routes: Route = get {
    complete(HttpEntity(ContentTypes.`text/plain(UTF-8)`, "Hello World"))
  }

}

object Application extends App {

  WebServer.startServer("0.0.0.0", 8080)

}
