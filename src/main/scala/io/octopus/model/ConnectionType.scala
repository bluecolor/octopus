package io.octopus.model

object ConnectionType {
  val SSH = "SSH"
  val FTP = "FTP"
  val JDBC= "JDBC"

  val types = Array(SSH, JDBC)

  def isSupported (t: String) = types contains t.toUpperCase

}