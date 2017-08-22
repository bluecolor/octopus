package io.octopus.model

object ConnectionType {
  val SSH   = "SSH"
  val FTP   = "FTP"
  val JDBC  = "JDBC"
  val LOCAL = "LOCAL"

  val types = Array(SSH, JDBC, LOCAL)

  def isSupported (t: String) = types contains t.toUpperCase

}
