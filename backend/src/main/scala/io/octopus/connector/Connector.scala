package io.octopus.connector

import io.octopus.model.{Connection}

trait Connector {

  def test: Boolean

}