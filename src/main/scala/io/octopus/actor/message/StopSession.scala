package io.octopus.actor.message

import io.octopus.model.Status

case class StopSession(sessionId: Long, status: String = Status.STOPPED)